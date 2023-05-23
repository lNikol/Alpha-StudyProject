module.exports = function saveUserFile(file, userId) {
  const { server_folder } = require("../config");
  const path = require("path");
  const fs = require("fs");
  if (file == "") {
    return Promise.resolve(["", ""]);
  } else {
    let filePath = `${server_folder}/${userId}`;
    if (!fs.existsSync(path.join(filePath))) fs.mkdirSync(path.join(filePath));

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
};
