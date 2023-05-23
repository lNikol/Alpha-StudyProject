const Router = require("express");

const roleMiddleware = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");
const router = new Router();

router.post(
  "/createCard",
  roleMiddleware(["USER", "ADMIN"]),
  userController.createCard
);
router.put(
  "/changePassword",
  roleMiddleware(["USER", "ADMIN"]),
  userController.changePassword
);
router.post("/sendExample", userController.sendExample);

module.exports = router;
