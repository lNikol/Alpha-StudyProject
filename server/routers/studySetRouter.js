const { check } = require("express-validator");
const Router = require("express");
const router = new Router();
const roleMiddleware = require("../middleware/roleMiddleware");
const studySetController = require("../controllers/studySetController");

router.get(
  "/cards",
  roleMiddleware(["USER", "ADMIN"]),
  studySetController.getCards
);

router.post(
  "/createSet",
  check("studysetName", "studysetName length from 2 to 16").isLength({
    min: 2,
    max: 16,
  }),
  roleMiddleware(["USER", "ADMIN"]),
  studySetController.createSet
);

router.put(
  "/changeName",
  check("newName", "newName length from 2 to 16").isLength({
    min: 2,
    max: 16,
  }),
  roleMiddleware(["USER", "ADMIN"]),
  studySetController.changeName
);

router.get(
  "/studysets",
  roleMiddleware(["USER", "ADMIN"]),
  studySetController.getStudySets
);

router.post(
  "/sendFile",
  roleMiddleware(["USER", "ADMIN"]),
  studySetController.sendFile
);

router.delete(
  "/deleteSet",
  roleMiddleware(["USER", "ADMIN"]),
  studySetController.deleteSet
);

module.exports = router;
