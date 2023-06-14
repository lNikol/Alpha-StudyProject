const pathm = require("path");
const { server_files_folder } = require("../config");
const fs = require("fs");
const File = require("../models/File");
const User = require("../models/User");
const FileService = require("../services/FileService");

class FileController {
  async createDir(req, res) {
    try {
      let { name, type, parent } = req.body;
      const file = new File({ name, type, parent, user: req.user.id });
      const parentFile = await File.findOne({ _id: parent });
      // Делаем определеныый путь для файла
      if (!parentFile) {
        file.path = name;
        await FileService.createDir(file);
      } else {
        file.path = pathm.join(parentFile.path, file.name);
        await FileService.createDir(file);
        parentFile.childs.push(file._id);
        await parentFile.save();
      }
      await file.save();
      return file;
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  }

  // async getFiles(req, res) {
  //   try {
  //     const files = await File.find({
  //       user: req.user.id,
  //       parent: req.query.parent,
  //     });
  //     return res.json(files);
  //   } catch (e) {
  //     console.log(e);
  //     res.status(500).json({ message: "Can not get files" });
  //   }
  // }

  async upload(req, res, next) {
    try {
      const file = req.files.userFile;
      const fileName = req.body.fileName;
      const parentForId = await File.findOne({
        user: req.user.id,
        name: req.body.studysetName,
      });

      const parent = await File.findOne({
        user: req.user.id,
        _id: req.body.parent || parentForId?._id,
      });

      const user = await User.findOne({ _id: req.user.id });

      if (user.usedSpace + file.size > user.diskSpace)
        return res.status(400).json({ message: "There no space on the disk" });
      user.usedSpace += file.size;

      let path;
      if (parent) {
        path = pathm.join(
          server_files_folder,
          user._id.toString(),
          parent.path,
          fileName
        );
      } else {
        path = pathm.join(server_files_folder, user._id.toString(), fileName);
      }
      if (fs.existsSync(path))
        return res.status(400).json({ message: "File exists" });

      file.mv(path);

      const type = fileName.split(".").pop();
      const dbFile = new File({
        name: fileName,
        type,
        size: file.size,
        path: parent?.path,
        parent: parent?._id,
        user: user._id,
      });
      if (parent) {
        parent.childs.push(dbFile);
        await parent.save();
      }
      await dbFile.save();

      let { studysetName } = req.body;
      if (studysetName != "" && studysetName != undefined) {
        user.studySets.map((i) => {
          if (i.name == studysetName) {
            i.files.push({ id: dbFile._id, name: dbFile.name });
          }
        });
        user.markModified("studySets");
      } else user.files.push(dbFile._id);

      await user.save();
      let sets = user.studySets.map((i) => i.name);
      return res.json(user.studySets[sets.indexOf(studysetName)]);
    } catch (e) {
      next(e);
    }
  }

  async deleteUserFile(req, res, next) {
    try {
      return res.json(
        await FileService.deleteUserFile("", "", req.body, req.user)
      );
    } catch (e) {
      next(e);
    }
  }

  async deleteSetFiles(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id });
      let { studysetName } = req.body;
      const parent = await File.findOne({
        user: req.user.id,
        name: studysetName,
      });

      parent?.childs.map(async (i, index) => {
        let size = (await File.findOne({ user: req.user.id, _id: i })).size;
        user.usedSpace -= size;
        await File.findOneAndRemove({ user: req.user.id, _id: i });
        parent.childs.splice(index, 1);
        user.markModified("usedSpace");
      });

      user.studySets.map(async (i, index) => {
        if (i.name == studysetName) user.studySets.splice(index, 1);
      });

      user.markModified("studySets");
      await File.findByIdAndRemove({
        user: req.user.id,
        _id: parent?._id,
      });

      await user.save();

      return res.json(
        await FileService.deleteSetFolder(req.user.id, studysetName)
      );
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Error deleting a studySet" });
    }
  }
}

module.exports = new FileController();
