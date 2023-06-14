const { jwt_access_secret, jwt_refresh_secret } = require("../config");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, jwt_access_secret, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, jwt_refresh_secret, {
      expiresIn: "15d",
    });
    return { accessToken, refreshToken };
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

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  }
}

module.exports = new TokenService();
