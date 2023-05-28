const Router = require("express");

const { check } = require("express-validator");
const roleMiddleware = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");
const cardController = require("../controllers/cardController");

const router = new Router();

router.post(
  "/registration",
  check("username", "Name cannot be empty").notEmpty(),
  check("password", "Password length from 4 to 20").isLength({
    min: 4,
    max: 20,
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

router.put(
  "/changeName",
  roleMiddleware(["USER", "ADMIN"]),
  userController.changeName
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

// router.post(
//   "/searchCard",
//   roleMiddleware(["USER", "ADMIN"]),
//   userController.searchCard
// );

router.post(
  "/communityCards",
  roleMiddleware(["USER", "ADMIN"]),
  userController.getCommunityCards
);

router.post(
  "/cards",
  roleMiddleware(["USER", "ADMIN"]),
  cardController.getCards
);

module.exports = router;
