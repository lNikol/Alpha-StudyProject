const File = require("../models/File");
const FileService = require("../services/FileService");
const pathm = require("path");
const User = require("../models/User");
const { server_files_folder } = require("../config");
const fs = require("fs");

class FileController {
  async createDir(req, res) {
    try {
      let { name, type, parent } = req.body;
      const file = new File({ name, type, parent, user: req.user.id });
      const parentFile = await File.findOne({ _id: parent });
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

  async getFiles(req, res) {
    try {
      const files = await File.find({
        user: req.user.id,
        parent: req.query.parent,
      });
      return res.json(files);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Can not get files" });
    }
  }

  async uploadFile(req, res, next) {
    try {
      const file = req.files.userFile;
      const parent = await File.findOne({
        user: req.user.id,
        _id: req.body.parent,
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
          file.name
        );
      } else {
        path = pathm.join(server_files_folder, user._id.toString(), file.name);
      }

      if (fs.existsSync(path))
        return res.status(400).json({ message: "File exists" });

      file.mv(path);
      const type = file.name.split(".").pop();
      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: parent?.path,
        parent: parent?._id,
        user: user._id,
      });

      await dbFile.save();
      await user.save();
      res.json(dbFile);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new FileController();
