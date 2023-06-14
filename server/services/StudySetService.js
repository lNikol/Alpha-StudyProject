const ApiError = require("../exceptions/api-error");
const StudySet = require("../models/StudySet");
const User = require("../models/User");
const FileService = require("./FileService");

class StudySetService {
  async createSet(folder, username, name) {
    if (folder === undefined)
      throw ApiError.BadRequest("Studyset with this name exists");
    const user = await User.findOne({ username });
    user.studySets.push(
      new StudySet({ name: name, parentFolder: folder.path, topic: name })
    );
    await user.save();
    return user.studySets;
  }

  //not used
  async changeName(username, name, newName) {
    if (!name) throw ApiError.BadRequest("name not found");
    const user = await User.findOne({ username });
    user.studySets.map((i) => {
      if (i.name == name) i.name = newName;
    });
    await user.save();
  }

  async getCards(username, name) {
    if (!name) throw ApiError.BadRequest("studysetName wasn't set");
    const user = await User.findOne({ username });
    let names = user.studySets.map((i) => {
      return i.name;
    });
    if (names.includes(name)) return user.studySets[names.indexOf(name)].cards;
    else throw ApiError.BadRequest("Studyset wasn't found");
  }

  async getStudySets(username) {
    const user = await User.findOne({ username });
    return user.studySets;
  }

  async deleteSet(user_id, setName) {
    const user = await User.findOne({ _id: user_id });
    user.studySets.map(async (i, index) => {
      if (i.name == setName) {
        user.studySets.splice(index, 1);
        user.markModified("studySets");
        await user.save();
      }
    });

    await FileService.deleteSetFolder(user_id, setName);
  }
}

module.exports = new StudySetService();
