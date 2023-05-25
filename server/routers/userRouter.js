const Router = require("express");

const { check } = require("express-validator");
const roleMiddleware = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");

const router = new Router();

router.post(
  "/registration",
  check("username", "Name cannot be empty").notEmpty(),
  check("password", "Password length from 4 to 10").isLength({
    min: 4,
    max: 10,
  }),
  userController.registration
);

router.post("/login", userController.login);

router.post(
  "/logout",
  roleMiddleware(["USER", "ADMIN"]),
  userController.logout
);

router.put(
  "/changePassword",
  roleMiddleware(["USER", "ADMIN"]),
  userController.changePassword
);

router.post(
  "/createCard",
  roleMiddleware(["USER", "ADMIN"]),
  userController.createCard
);

router.delete(
  "/deleteAccount",
  roleMiddleware(["USER", "ADMIN"]),
  userController.deleteAccount
);

router.get(
  "/refresh",
  roleMiddleware(["USER", "ADMIN"]),
  userController.refresh
);

router.post(
  "/sendExample",
  roleMiddleware(["USER", "ADMIN"]),
  userController.sendExample
);

router.post(
  "/searchCard",
  roleMiddleware(["USER", "ADMIN"]),
  userController.searchCard
);

module.exports = router;
