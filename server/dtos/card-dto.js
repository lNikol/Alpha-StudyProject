module.exports = class CardDto {
  name;
  descriptions;
  tags;
  favorite;
  constructor(model) {
    this.name = model.name;
    this.descriptions = model.descriptions;
    this.tags = model.tags;
    this.favorite = model.favorite;
  }
};
