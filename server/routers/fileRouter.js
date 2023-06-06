const Router = require("express");
const fileController = require("../controllers/fileController");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = new Router();

router.get("", roleMiddleware(["USER", "ADMIN"]), fileController.getFiles);
router.post(
  "/upload",
  roleMiddleware(["USER", "ADMIN"]),
  fileController.upload
);
router.delete(
  "/deleteSetFiles",
  roleMiddleware(["USER", "ADMIN"]),
  fileController.deleteSetFiles
);
router.get;
module.exports = router;
