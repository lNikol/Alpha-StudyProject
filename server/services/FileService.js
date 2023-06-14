const { server_files_folder } = require("../config");
const fs = require("fs");
const path = require("path");
const File = require("../models/File");
const User = require("../models/User");

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

  async deleteDir(user_id) {
    let userFolder = path.join(server_files_folder, user_id.toString());
    if (fs.existsSync(userFolder)) {
      fs.readdir(userFolder, (e, files) => {
        files.forEach((file) => {
          fs.unlink(`${userFolder}/${file}`, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        });
      });
      fs.rm(userFolder, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
  }

  async deleteUserFile(root, filePath, body, user) {
    let setDB = "";
    if (root === "") {
      const { set, fileName, fileId } = body;
      const userDB = await User.findOne({ _id: user.id });
      userDB.studySets.map((i) => {
        if (i.name == set) {
          setDB = i;
          i.files.map(async (f, index) => {
            if (f.id.toString() == fileId) {
              i.files.splice(index, 1);
              userDB.markModified("studySets");
              await userDB.save();
            }
          });
        }
      });
      await File.findOneAndRemove({ _id: fileId });

      filePath = path.join(server_files_folder, user.id, set, fileName);
    }
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      if (root != "") fs.rmdirSync(root);
    }
    return setDB;
  }

  async saveUserFile(file, userId) {
    const { server_folder } = require("../config");
    const path = require("path");
    if (file == "") {
      return Promise.resolve(["", ""]);
    } else {
      let filePath = `${server_folder}/${userId}`;
      if (!fs.existsSync(path.join(filePath)))
        fs.mkdirSync(path.join(filePath));

      return new Promise((resolve, reject) => {
        file.mv(path.join(filePath, file.name), (err) => {
          if (err) {
            reject(err);
          } else {
            resolve([filePath, `${filePath}/${file.name}`]);
          }
        });
      });
    }
  }

  async deleteSetFolder(user_id, setName) {
    let userFolder = path.join(
      server_files_folder,
      user_id.toString(),
      setName
    );
    if (fs.existsSync(userFolder)) {
      fs.readdir(userFolder, (e, files) => {
        files.forEach((file) => {
          fs.unlink(`${userFolder}/${file}`, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        });
      });
      fs.rm(userFolder, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
  }
}

module.exports = new FileService();
