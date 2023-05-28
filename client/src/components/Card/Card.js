export default function Card({
  name,
  descriptions,
  tags,
  favorite,
  knowledge,
}) {
  return (
    <div style={{ marginLeft: "20px" }}>
      <p>{name}</p>
      <div style={{ display: "inline-block" }}>
        {descriptions.map((d, index) => (
          <b key={d + index}>{d}</b>
        ))}
      </div>
      <p></p>
      <div>
        {tags.map((t, index) => (
          <i key={t + index}>{t} </i>
        ))}
      </div>
    </div>
  );
}
