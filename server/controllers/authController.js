const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("../config");
const User = require("../models/User");
const Role = require("../models/Role");

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
          .status(500)
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
        return res.status(500).json({ message: `User ${username} not found` });
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
}
module.exports = new authController();
