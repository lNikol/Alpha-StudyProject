export default function UnsuccessList({ unsuccessCards, setShow }) {
  return (
    <div>
      {unsuccessCards.map((i) => {
        <div style={{ display: "inline-block" }}>
          <div class="original">{i.original}</div>
          <div class="translate">{i.translate}</div>
        </div>;
      })}
      <button
        onClick={() => {
          setShow(false);
        }}>
        Go back
      </button>
    </div>
  );
}
