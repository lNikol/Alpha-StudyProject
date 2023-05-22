const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const roleMiddleware = require("./middleware/roleMiddleware");

router.post(
  "/registration",
  [
    check("username", "Name cannot be empty").notEmpty(),
    check("password", "Password length from 4 to 10").isLength({
      min: 4,
      max: 10,
    }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", roleMiddleware(["USER"]), controller.getUsers);
router.post(
  "/createCard",
  roleMiddleware(["USER", "ADMIN"]),
  controller.createCard
);

module.exports = router;
