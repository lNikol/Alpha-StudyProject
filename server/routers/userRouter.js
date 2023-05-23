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
router.post("/logout", roleMiddleware(["USER","ADMIN"]), userController.logout);
router.post("/searchCard", roleMiddleware(["USER","ADMIN"]), userController.searchCard)
router.delete("/deleteAccount", roleMiddleware(["USER"]), userController.deleteAccount);


module.exports = router;
