const ApiError = require("../exceptions/api-error");
const CardService = require("../services/CardService");

class CardController {
  async create(req, res, next) {
    try {
    } catch (e) {
      next(e);
    }
  }

  // async update(req, res, next) {
  //   try {
  //     const updatedCard = await CardService.update(req.body);
  //     return res.json(updatedCard);
  //   } catch (e) {
  //     console.log(e);
  //     next(e);
  //   }
  // }

  async deleteCardById(req, res, next) {
    try {
      await CardService.deleteCardById(req.body);
      return res.json({ message: "Card was deleted" });
    } catch (e) {
      next(e);
    }
  }

  async replaceFavorite(req, res, next) {
    try {
      const { cardname, favorite } = req.body;
      if (!cardname) throw ApiError.BadRequest("Cardname wasn't set");
      await CardService.replaceFavorite(req.user.username, cardname, favorite);
      res.json(`Favorite for ${cardname} was changed`);
    } catch (e) {
      next(e);
    }
  }

  async getCards(req, res, next) {
    try {
      return res.json(await CardService.getCards(req.user.username));
    } catch (e) {
      next(e);
    }
  }

  async replaceCardsState(req, res, next) {
    try {
      // changing knowledge
      const { cardsForChange } = req.body;
      if (!cardsForChange)
        throw ApiError.BadRequest("CardsForChanged weren't set");
      await CardService.replaceCardsState(req.user.username, cardsForChange);
      return res.json({ message: "Card state was changed" });
    } catch (e) {
      next(e);
    }
  }
}
module.exports = new CardController();
