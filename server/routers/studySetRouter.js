const Router = require("express");
const { check } = require("express-validator");
const studySetController = require("../controllers/studySetController");
const router = new Router();
const roleMiddleware = require("../middleware/roleMiddleware");

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

module.exports = router;
