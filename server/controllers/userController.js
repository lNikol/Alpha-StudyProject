const excelReader = require("../helpers/excelReader");
const { template_path } = require("../config");

const User = require("../models/User");
const Card = require("../models/Card");
const File = require("../models/File");

const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const UserService = require("../services/UserService");
const FileService = require("../services/FileService");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Error during registration",
          errors: errors.errors,
        });
      }
      const { username, password } = req.body;

      const userData = await UserService.registration(username, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      await FileService.createDir(
        new File({ user: userData.user.id, name: "" })
      );
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const userData = await UserService.login(username, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async deleteAccount(req, res, next) {
    try {
      res.clearCookie("refreshToken");
      return res.json(await UserService.deleteAccount(req.user.username));
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async createCard(req, res) {
    try {
      let { cardname, descriptions, tags, studySet } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty() && req.files.userFile === undefined) {
        return res.status(400).json({
          message: "Error during creating card",
          errors: errors.errors,
        });
      }

      if (tags) tags = tags.split(";").filter((i) => i != "");
      if (descriptions)
        descriptions = descriptions.split(";").filter((i) => i != "");

      let username = req.user.username;
      const candidate = await User.findOne({ username });
      let setsNames = candidate.studySets.map((i) => i.name);
      let currentSet = candidate.studySets[setsNames.indexOf(studySet)];
      let userCardsNames = currentSet.cards.map((i) => i?.name);
      let cardExists = false;

      let userFile = "";
      if (req.files) userFile = req.files.userFile;

      if (userFile != "") {
        let [rootPath, userFilePath] = await FileService.saveUserFile(
          userFile,
          candidate._id
        );

        await excelReader(userFilePath)
          .then(async (cards) => {
            if (cards) {
              let existsCards = [];
              let startLength = currentSet.cards.length;
              cards.map((i) => {
                cardExists = userCardsNames.includes(i.name) ? true : false;
                if (cardExists) {
                  existsCards.push(i.name);
                } else {
                  if (
                    i.descriptions.length >= 6 &&
                    typeof i.descriptions == "object"
                  ) {
                    FileService.deleteUserFile(
                      rootPath,
                      candidate._id.toString()
                    );
                    res.status(400).json({
                      message: `In the ${i.name} length of descriptions >=6`,
                    });
                  } else if (i.tags.length >= 6 && typeof i.tags == "object") {
                    FileService.deleteUserFile(
                      rootPath,
                      candidate._id.toString()
                    );
                    res.status(400).json({
                      message: `In the ${i.name} length of tags >=6`,
                    });
                  } else {
                    if (typeof i.descriptions == "object")
                      i.descriptions = i.descriptions.filter((i) => i != "");
                    if (typeof i.tags == "object")
                      i.tags = i.tags.filter((i) => i != "");
                    currentSet.cards.push(
                      new Card({
                        name: i.name,
                        descriptions: i.descriptions,
                        tags: i.tags ? i.tags : [],
                        date: new Date().getTime(),
                        user: candidate._id,
                        favorite: false,
                      })
                    );
                    userCardsNames = currentSet.cards.map((i) => i.name);
                  }
                }
              });

              if (startLength != currentSet.cards.length) {
                candidate.markModified("studySets");
                await candidate.save();
              }

              if (existsCards.length > 0) {
                res.status(500).json({
                  message: "Cards weren't added because they already exist",
                  existsCards: existsCards,
                  set: currentSet,
                });
              } else {
                res.json({
                  set: currentSet,
                  message: "The cards have been added successfully",
                });
              }
            }

            await FileService.deleteUserFile(rootPath, userFilePath);
          })
          .catch((e) => {
            console.log(e);
            res
              .status(500)
              .json({ message: "Error occurred while reading the excel file" });
          });
      } else {
        cardExists = userCardsNames.includes(cardname) ? true : false;

        if (cardExists)
          return res.status(500).json({ message: "This card already exists" });
        else {
          if (!cardname || !descriptions || !tags) {
            return res
              .status(400)
              .json({ message: "Incomplete data provided" });
          } else {
            if (descriptions.length >= 6) {
              res.status(400).json({
                message: `In the ${cardname} length of descriptions >=6`,
              });
            }
            if (tags.length >= 6) {
              res.status(400).json({
                message: `In the ${cardname} length of tags >=6`,
              });
            }
            currentSet.cards.push(
              new Card({
                name: cardname,
                descriptions: descriptions,
                tags: tags ? tags : [],
                date: new Date().getTime(),
                user: candidate._id,
                favorite: false,
              })
            );
          }
          candidate.markModified("studySets");
          await candidate.save();
        }
        return res.json({ message: "Card was created", set: currentSet });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error in creating card" });
    }
  }

  async changePassword(req, res, next) {
    try {
      let { newPassword, oldPassword: password } = req.body;
      if (!newPassword) throw ApiError.BadRequest("newPassword wasn't set");
      await UserService.changePassword(
        req.user.username,
        password,
        newPassword
      );
      return res.json({ message: "Password was changed" });
    } catch (e) {
      next(e);
    }
  }

  async changeName(req, res, next) {
    try {
      let { newName } = req.body;
      if (!newName) throw ApiError.BadRequest("New name wasn't set");
      await UserService.changeName(req.user.username, newName);
      return res.json({ message: "Name was changed" });
    } catch (e) {
      next(e);
    }
  }

  async sendExample(req, res) {
    try {
      res.download(template_path);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getCommunityCards(req, res, next) {
    try {
      return res.json(await UserService.getCommunityCards());
    } catch (e) {
      next(e);
    }
  }

  async getUserById(req, res, next) {
    try {
      return res.json(
        (await UserService.getUserById(req.body.userId))[0].username
      );
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
