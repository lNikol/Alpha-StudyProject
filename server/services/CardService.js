const User = require("../models/User");

class CardService {
  async deleteCardById(username, set, cardId) {
    const user = await User.findOne({ username });
    if (!cardId) throw new Error("Id not specified");
    let sets = user.studySets.map((i) => i.name);
    let currentSet = user.studySets[sets.indexOf(set)];
    currentSet.cards.splice(
      currentSet.cards.indexOf(currentSet.cards.find((i) => i._id == cardId)),
      1
    );
    user.markModified("studySets");
    await user.save();
    return currentSet;
  }

  // Not used in this version
  async replaceFavorite(username, cardname, favorite, studyset) {
    const candidate = await User.findOne({ username });
    candidate.studySets.map((i) => {
      if (i.name == studyset) {
        i.cards.map((c) => {
          if (c.name == cardname) {
            c.favorite = favorite;
          }
        });
      }
    });

    candidate.markModified("studySets");
    await candidate.save();
  }

  // Not used in this version
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
