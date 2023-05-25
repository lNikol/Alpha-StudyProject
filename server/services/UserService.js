const UserDto = require("../dtos/user-dto");
const Role = require("../models/Role");
const User = require("../models/User");
const TokenService = require("./TokenService");
const bcrypt = require("bcryptjs");
const ApiError = require("../exceptions/api-error");
const jwt = require("jsonwebtoken");
const { jwt_access_secret, jwt_refresh_secret } = require("../config");

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
      studySet: {},
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
}
module.exports = new UserService();
