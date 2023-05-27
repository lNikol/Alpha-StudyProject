const Router = require("express");
const fileController = require("../controllers/fileController");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = new Router();

router.get("", roleMiddleware(["USER", "ADMIN"]), fileController.getFiles);
router.post(
  "/uploadFile",
  roleMiddleware(["USER", "ADMIN"]),
  fileController.uploadFile
);
module.exports = router;
