const User = require("./models/User");
const Role = require("./models/Role");
const Card = require("./models/Card");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

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
      const { username, password } = req.body;
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
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      console.log(user.studySet);
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
      const File = new File();
      File.save();
      const StudySet = new StudySet();
      StudySet.save();

      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }

  async createCard(req, res) {
    try {
      const { username } = req.body;
      const { cardname, descriptions, tags } = req.body; //req.body
      console.log(cardname, descriptions, tags);
      const candidate = await User.findOne({ username });

      let cardExists = candidate.cards.every((e) => {
        e.cardname != cardname;
      });
      console.log(!cardExists);
      // candidate.cards.push(
      //   new Card({
      //     name: cardname,
      //     descriptions: descriptions,
      //     tags: tags ? tags : [],
      //     date: new Date().getTime(),
      //   })
      // );
      // candidate.save();
      return { message: "Card was created" };
    } catch (e) {
      console.log(e);
      res.send(400).json({ message: "Error in creating card" });
    }
  }
  // async userFile(req, res){
  //   try{
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(400)
  //         .json({ message: "Error during sending file", errors });
  //     }
  //   } catch(e){
  //     console.log(e);
  //     res.status(400).json({message:"Send userFile error"})
  //   }
  // }

  async getCards(req, res) {
    try {
      let { username } = req.body;
      const candidate = await User.findOne({ username });

      // candidate.cards.push(
      //   new Card({
      //       name:"fromPush",
      //       descriptions:['push1','push2'],
      //       tags:[],
      //       date:new Date().getTime(),
      //       user:candidate._id
      //     }))
      // const card = new Card({
      //   name:"testCard3",
      //   descriptions:['test13','test23'],
      //   tags:[],
      //   date:new Date().getTime(),
      //   user:candidate._id
      // })
      // await card.save();

      const cards = await Card.find(); // получение карточек, которые находятся не в пользователе
      res.json(cards);
    } catch (e) {
      console.log(e);
      res.send(400).json({ message: "Error during getting cards" });
    }
  }
}
module.exports = new authController();
