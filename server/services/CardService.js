const ApiError = require("../exceptions/api-error");
const User = require("../models/User");

class CardService {
  // async update(card) {
  //   if (!card._id) {
  //     throw new Error("Id not specified");
  //   }
  //   const updatedCard = await Card.findByIdAndUpdate(card._id, card, {
  //     new: true,
  //   });
  //   return updatedCard;
  // }

  async deleteCardById({ username, cardId }) {
    const user = await User.findOne({ username });
    if (!cardId) throw new Error("Id not specified");
    let afterFilter = user.cards.filter((card) => card._id === cardId);
    let index = 0;
    user.cards.map((i) => {
      if (i._id == cardId) index = user.cards.indexOf(i);
    });
    if (
      user.cards.length != 0 &&
      user.cards.length != afterFilter.length &&
      afterFilter.length != 0
    ) {
      user.cards.splice(index, 1);
      await user.save();
    }
    if (
      user.cards.length == afterFilter.length ||
      afterFilter.length == 0 ||
      user.cards.length == 0
    )
      throw ApiError.BadRequest("Card wasn't found");
  }

  async create(card) {
    if (!card) throw new Error("Card wasn't set");
  }

  async replaceFavorite(username, cardname, favorite) {
    const candidate = await User.findOne({ username });
    let copy = candidate.cards;
    copy.map((i) => {
      if (i.name == cardname) i.favorite = favorite;
    });
    candidate.cards = [];
    candidate.cards = copy;
    await candidate.save();
  }

  async getCards(username) {
    let user = await User.findOne({ username });
    return user.cards;
  }

  async replaceCardsState(username, cardsForChange) {
    // cardsForChange - [{name:name, knowledge:newKnowledge},{name:name, knowledge:newKnowledge}]
    // knowledge - bad, ok, good
    const candidate = await User.findOne({ username });
    let copy = candidate.cards;
    copy.map((i) => {
      cardsForChange.map((c) => {
        if (i.name == c.name) {
          i.knowledge = c.knowledge;
        }
      });
    });
    candidate.cards = [];
    candidate.cards = copy;
    await candidate.save();
  }
}
module.exports = new CardService();
