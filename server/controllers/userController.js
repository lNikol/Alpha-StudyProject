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

  async searchCard(req,res){
    try {
      const {searchcard, username} = req.headers;
      let user = await User.findOne({username})
      let userWithCard = await User.findOne({'cards.name':searchcard});
      if(!searchcard) res.status(400).json({message:"Card for search wasn't selected"})
      if(userWithCard==null || username != userWithCard?.username){
        res.status(500).json({message:"Card wasn't found"});
      }
      user.cards.map((i)=>{if(i.name == searchcard) res.json(i)})

    } catch (e) {
      console.log(e);
    }
  }
 
  async logout(req, res) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      // req.rawHeaders[req.rawHeaders.indexOf('Authorization')+1] = `Bearer ${token+Math.floor(Math.random()*30+13)}`
      // console.log(req.headers.authorization)

    } catch (e) {
      console.log(e);
    }
  }

  async deleteAccount(req, res) { 
    try {
      const {username} = req.headers;
      const user = await User.findOne({username});
      if(!user) res.send(500).json({message:"User wasn't found"})
      console.log(user)
      user.deleteOne({username:username});
      res.json(user);
    } catch (e) {
      console.log(e);
    }
  }
}
module.exports = new UserController();
