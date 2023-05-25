const Router = require("express");
const router = new Router();
const controller = require("../controllers/authController");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/users", roleMiddleware(["USER", "ADMIN"]), controller.getUsers);

module.exports = router;
