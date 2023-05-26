const Router = require("express");
const fileController = require("../controllers/fileController");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = new Router();

router.post("", roleMiddleware(["USER", "ADMIN"]), fileController.createDir);

module.exports = router;
