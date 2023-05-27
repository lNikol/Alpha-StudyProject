const excelReader = require("../helpers/excelReader");
const saveUserFile = require("../helpers/saveUserFile");
const deleteUserFile = require("../helpers/deleteUserFile");
const { template_path } = require("../config");
const User = require("../models/User");
const Card = require("../models/Card");
const bcrypt = require("bcryptjs");
const UserService = require("../services/UserService");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const FileService = require("../services/FileService");
const File = require("../models/File");

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

  async createCard(req, res, next) {
    try {
      let { cardname, descriptions, tags } = JSON.parse(req.body.user);
      let username = req.user.username;
      const candidate = await User.findOne({ username });
      let userCardsNames = candidate.cards.map((i) => i?.name);
      let cardExists = false;

      let userFile = "";
      if (req.files) userFile = req.files.userFile;

      if (userFile != "") {
        if (!userFile.name.includes(".xlsx"))
          return res
            .status(401)
            .json({ message: "File extension isn't .xlsx" });

        let [rootPath, userFilePath] = await saveUserFile(
          userFile,
          candidate._id
        );
        await excelReader(userFilePath)
          .then(async (cards) => {
            if (cards) {
              let existsCards = [];
              let startLength = candidate.cards.length;
              cards.map((i) => {
                cardExists = userCardsNames.includes(i.name) ? true : false;
                if (cardExists) {
                  existsCards.push(i.name);
                } else {
                  candidate.cards.push(
                    new Card({
                      name: i.name,
                      descriptions: i.descriptions,
                      tags: i.tags ? i.tags : [],
                      date: new Date().getTime(),
                    })
                  );
                  userCardsNames = candidate.cards.map((i) => i.name);
                }
              });

              if (startLength != candidate.cards.length) await candidate.save();

              if (existsCards.length > 0) {
                res.status(500).json({
                  message: "Cards weren't added because they already exist",
                  existsCards: existsCards,
                });
              } else {
                res.json({ message: "The cards have been added successfully" });
              }
            }

            await deleteUserFile(rootPath, userFilePath);
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
            candidate.cards.push(
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
          await candidate.save();
        }
        return res.json({ message: "Card was created" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error in creating card" });
    }
  }

  async changePassword(req, res, next) {
    try {
      let { newpassword, password } = req.body;
      if (!newpassword) throw ApiError.BadRequest("New password wasn't set");
      const username = req.user.username;
      const candidate = await User.findOne({ username });
      const oldPassword = candidate.password;
      const hashPassword = bcrypt.hashSync(newpassword, 7);
      if (bcrypt.compareSync(password, oldPassword))
        candidate.password = hashPassword;
      else throw ApiError.BadRequest("Invalid password");
      await candidate.save();
      return res.json("Password was changed");
    } catch (e) {
      console.log(e);
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

  // async searchCard(req, res) {
  //   try {
  //     //searchcard - name of card
  //     const { searchcard } = JSON.parse(req.body.user);
  //     const { username } = req.user.username;
  //     let user = await User.findOne({ username });
  //     let userWithCard = await User.findOne({ "cards.name": searchcard });
  //     if (!searchcard)
  //       res.status(400).json({ message: "Card for search wasn't selected" });
  //     if (userWithCard == null || username != userWithCard?.username) {
  //       res.status(500).json({ message: "Card wasn't found" });
  //     }
  //     user.cards.map((i) => {
  //       if (i.name == searchcard) res.json(i);
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

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
      return await UserService.deleteAccount(req.user.username);
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

  async getCommunityCards(req, res, next) {
    try {
      return res.json(await UserService.getCommunityCards());
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
