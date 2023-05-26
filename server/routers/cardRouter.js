const Router = require("express");
const cardController = require("../controllers/cardController");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = new Router();
router.put(
  "/replaceFavorite",
  roleMiddleware(["USER", "ADMIN"]),
  cardController.replaceFavorite
);

router.put(
  "/replaceCardsState",
  roleMiddleware(["USER", "ADMIN"]),
  cardController.replaceCardsState
);

router.delete(
  "/deleteCardById",
  roleMiddleware(["USER", "ADMIN"]),
  cardController.deleteCardById
);

module.exports = router;
