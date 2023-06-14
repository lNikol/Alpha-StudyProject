const Router = require("express");
const router = new Router();
const roleMiddleware = require("../middleware/roleMiddleware");
const cardController = require("../controllers/cardController");

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
