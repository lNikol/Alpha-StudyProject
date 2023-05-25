const ApiError = require("../exceptions/api-error");
const TokenService = require("../services/TokenService");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req?.headers?.authorization.split(" ")[1];

      const refreshToken = req.cookies.refreshToken;
      if (!token && !refreshToken) {
        next(ApiError.UnauthorizedError());
      }

      let userData = TokenService.validateAccessToken(token);
      if (!userData) userData = TokenService.validateRefreshToken(refreshToken);
      if (!userData) next(ApiError.UnauthorizedError());

      let { roles: userRoles } = userData;
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) hasRole = true;
      });
      if (!hasRole) {
        return res.status(403).json({ message: "You don't have access" });
      }
      next();
    } catch (e) {
      console.log(e);
      return res.status(403).json({ message: "User is not logged in" });
    }
  };
};
