import Card from "../models/Card";

class CardService {
  async update(card) {
    if (!card._id) {
      throw new Error("Id not specified");
    }
    const updatedCard = await Card.findByIdAndUpdate(card._id, card, {
      new: true,
    });
    return updatedCard;
  }

  async deleteCardById(id) {
    if (!id) throw new Error("Id not specified");
    const card = await Card.findByIdAndDelete(id);
    return res.json(card);
  }
}
export default new CardService();
