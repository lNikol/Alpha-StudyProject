const { default: CardService } = require("../services/CardService");

class CardController {
  async create(req, res) {
    try {
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  }
  async update(req, res) {
    try {
      const updatedCard = await CardService.update(req.body);
      return res.json(updatedCard);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async deleteCardById(req, res) {
    try {
      const card = await CardService.deleteCardById(req.body.id);
      return res.json(card);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
module.exports = new CardController();
