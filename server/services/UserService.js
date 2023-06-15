const { jwt_access_secret, jwt_refresh_secret } = require("../config");
const ApiError = require("../exceptions/api-error");
const UserDto = require("../dtos/user-dto");

const Role = require("../models/Role");
const User = require("../models/User");
const File = require("../models/File");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TokenService = require("./TokenService");
const FileService = require("./FileService");

class UserService {
  async registration(username, password) {
    const candidate = await User.findOne({ username });
    if (candidate) {
      throw ApiError.BadRequest("User with this name already exists");
    }
    const hashPassword = bcrypt.hashSync(password, 7);
    const userRole = await Role.findOne({ value: "USER" });
    const user = await User.create({
      username,
      password: hashPassword,
      roles: userRole.value,
    });

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async login(username, password) {
    const user = await User.findOne({ username });
    if (!user) {
      throw ApiError.BadRequest(`User ${username} not found`);
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      throw ApiError.BadRequest("Invalid password entered");
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  async deleteAccount(username) {
    const user = await User.findOne({ username });
    if (!user) throw ApiError.BadRequest("User wasn't found");
    await File.find({ user: user._id }).deleteMany();
    FileService.deleteDir(user._id);
    await user.deleteOne();
    return user;
  }

  async changePassword(username, password, newpassword) {
    const user = await User.findOne({ username });
    if (!user) throw ApiError.BadRequest("User wasn't found");

    if (bcrypt.compareSync(password, user.password)) {
      if (bcrypt.compareSync(newpassword, user.password))
        throw ApiError.BadRequest("The new password cannot match the old one");
      else user.password = bcrypt.hashSync(newpassword, 7);
    } else throw ApiError.BadRequest("Invalid password");

    await user.save();
    return user;
  }

  async changeName(username, newName) {
    const user = await User.findOne({ username });
    const candidates = await User.find({ username: newName });
    if (candidates.length >= 1)
      throw ApiError.BadRequest("User with this name exists");
    if (!user) throw ApiError.BadRequest("User wasn't found");
    user.username = newName;
    await user.save();
    return user;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, jwt_access_secret);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, jwt_refresh_secret);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async refresh(refreshToken_) {
    if (!refreshToken_) throw ApiError.UnauthorizedError();
    const userData = TokenService.validateRefreshToken(refreshToken_);
    const { refreshToken: tokenFromDb } = await TokenService.findToken(
      refreshToken_
    );
    if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError();

    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async getCommunityCards() {
    const users = await User.find();
    let cards = [];
    users.map((i) => {
      if (i.studySets.length >= 1) {
        i.studySets.map((s) => {
          if (s.cards.length >= 1)
            cards.push({ studyName: s.name, cards: s.cards });
        });
      } else if (i.studySets.length == 0) "";
    });

    return cards;
  }

  async getUserById(userId) {
    return User.find({ _id: userId });
  }
}
module.exports = new UserService();
