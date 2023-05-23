const excelReader = require("../helpers/excelReader");
const saveUserFile = require("../helpers/saveUserFile");
const deleteUserFile = require("../helpers/deleteUserFile");
const { template_path } = require("../config");
const User = require("../models/User");
const Card = require("../models/Card");
const bcrypt = require("bcryptjs");

class UserController {
  async createCard(req, res) {
    try {
      let { username, cardname, descriptions, tags } = req.headers; //req.headers / req.body
      const candidate = await User.findOne({ username });
      let userCardsNames = candidate.cards.map((i) => i.name);
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
              .send(500)
              .json({ message: "Error occurred while reading the excel file" });
          });
      } else {
        cardExists = userCardsNames.includes(cardname) ? true : false;
        if (cardExists)
          return res.status(500).json({ message: "This card already exists" });
        else {
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
          await candidate.save();
        }
        return res.json({ message: "Card was created" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error in creating card" });
    }
  }

  async changePassword(req, res) {
    const { username, newpassword } = req.headers;
    const candidate = await User.findOne({ username });
    const hashPassword = bcrypt.hashSync(newpassword, 7);
    candidate.password = hashPassword;

    await candidate.save();
    res.json(candidate);
    try {
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ message: "Error occurred while changing password" });
    }
  }

  async sendExample(req, res) {
    try {
      res.download(template_path);
    } catch (e) {
      console.log(e);
      res.send(500).json(e);
    }
  }

  async deleteAccount(req, res) {
    try {
    } catch (e) {
      console.log(e);
    }
  }

  async logout(req, res) {
    try {
    } catch (e) {
      console.log(e);
    }
  }
}
module.exports = new UserController();
