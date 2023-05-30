import Card from "../Card/Card";

export default function CardsGrid({ cards }) {
  <div style={{ marginLeft: "5px" }}>
    {cards.map((i, index) => (
      <div
        key={index + "_"}
        style={{
          margin: "10px",
          border: "1px solid blue",
          width: "200px",
          // display: "grid",
          // gridTemplateColumns: "200px 200px 200px",
        }}>
        <Card key={i + index} {...i} />
      </div>
    ))}
  </div>;
}
