const Router = require("express");
const router = new Router();
const roleMiddleware = require("../middleware/roleMiddleware");
const fileController = require("../controllers/fileController");

// router.get("", roleMiddleware(["USER", "ADMIN"]), fileController.getFiles);
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
router.delete(
  "/deleteFile",
  roleMiddleware(["USER", "ADMIN"]),
  fileController.deleteUserFile
);

router.get;
module.exports = router;
