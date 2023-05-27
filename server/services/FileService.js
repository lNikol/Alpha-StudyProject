const fs = require("fs");
const path = require("path");
const { server_files_folder } = require("../config");

class FileService {
  async createDir(file) {
    const filePath = path.join(
      server_files_folder,
      file.user.toString(),
      file.path
    );

    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);

          return resolve({ message: "File was created" });
        } else {
          return reject({ message: "File exists" });
        }
      } catch (e) {
        console.log(e);
        return reject({ message: "File error" });
      }
    });
  }
}

module.exports = new FileService();
