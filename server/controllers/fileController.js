const File = require("../models/File");
const FileService = require("../services/FileService");
const path = require("path");

class FileController {
  async createDir(req, res) {
    try {
      const { name, type, parent } = req.body;
      const file = new File({ name, type, parent, user: req.user.id });
      const parentFile = await File.findOne({ _id: parent });

      if (!parentFile) {
        file.path = name;
        await FileService.createDir(file);
      } else {
        file.path = path.join(parentFile.path, file.name);
        await FileService.createDir(file);
        parentFile.childs.push(file._id);
      }
      await parentFile.save();
      res.json(file);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  }
}

module.exports = new FileController();
