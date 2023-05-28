const ApiError = require("../exceptions/api-error");
const StudySet = require("../models/StudySet");
const User = require("../models/User");

class StudySetService {
  async createSet(folder, username, name) {
    const user = await User.findOne({ username });
    user.studySets.push(
      new StudySet({ name: name, parentFolder: folder.path, topic: name })
    );
    await user.save();
    return user.studySets;
  }

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
}

module.exports = new StudySetService();
