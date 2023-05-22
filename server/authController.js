const User = require("./models/User");
const Role = require("./models/Role");
const Card = require("./models/Card");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");
const excelReader = require("./helpers/excelReader");
const saveUserFile = require("./helpers/saveUserFile");
const deleteUserFile = require("./helpers/deleteUserFile");

const generateAccessToken = (id, roles) => {
  const payload = { id, roles };
  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Error during registration", errors });
      }
      const { username, password } = req.headers;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with this name already exists" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });

      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
        studySet: {},
      });
      await user.save();
      return res.json({ message: "success" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.headers;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: `User ${username} not found` });
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password entered" });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }

  async createCard(req, res) {
    try {
      let { username, cardname, descriptions, tags } = req.headers; //req.headers / req.body
      const candidate = await User.findOne({ username });
      console.log(candidate.cards);
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
                }
              });

              if (startLength != candidate.cards.length) await candidate.save();

              if (existsCards.length > 0) {
                res.status(400).json({
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
          });
      } else {
        cardExists = userCardsNames.includes(cardname) ? true : false;
        if (cardExists)
          return res.status(400).json({ message: "This card already exists" });
        else {
          candidate.cards.push(
            new Card({
              name: cardname,
              descriptions: descriptions,
              tags: tags ? tags : [],
              date: new Date().getTime(),
            })
          );
          await candidate.save();
        }
        return res.json({ message: "Card was created" });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Error in creating card" });
    }
  }
}
module.exports = new authController();
