module.exports = async function deleteUserFile(root, filePath) {
  const fs = require("fs");
  fs.unlinkSync(filePath);
  fs.rmdirSync(root);
};
