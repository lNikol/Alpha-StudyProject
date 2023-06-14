const ApiError = require("../exceptions/api-error");
const CardService = require("../services/CardService");

class CardController {
  async deleteCardById(req, res, next) {
    try {
      const { set, cardId } = req.body;
      return res.json(
        await CardService.deleteCardById(req.user.username, set, cardId)
      );
    } catch (e) {
      next(e);
    }
  }

  // Not used in this version
  async replaceFavorite(req, res, next) {
    try {
      //changing a 'favorite' state to another one
      const { cardname, favorite, studyset } = req.body;
      if (!cardname) throw ApiError.BadRequest("Cardname wasn't set");
      await CardService.replaceFavorite(
        req.user.username,
        cardname,
        favorite,
        studyset
      );
      return res.json(`Favorite for ${cardname} was changed`);
    } catch (e) {
      next(e);
    }
  }

  // Not used in this version
  async replaceCardsState(req, res, next) {
    try {
      // changing knowledge
      const { cardsForChange } = req.body;
      if (!cardsForChange)
        throw ApiError.BadRequest("CardsForChange weren't set");
      await CardService.replaceCardsState(req.user.username, cardsForChange);
      return res.json({ message: "Card state was changed" });
    } catch (e) {
      next(e);
    }
  }
}
module.exports = new CardController();
