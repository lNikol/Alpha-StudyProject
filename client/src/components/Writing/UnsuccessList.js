import { useNavigate } from "react-router-dom";

export default function UnsuccessList({ unsuccessCards, setShow }) {
  const navigate = useNavigate();
  const goBack = () => {
    setShow(false);
    navigate("/library");
  };
  return unsuccessCards?.length >= 1 ? (
    <div className="m-3">
      {unsuccessCards.map((i, index) => (
        <ul key={i + index} className="list-group list-group-horizontal-sm m-2">
          <li className="list-group-item list-group-item-success">
            {i.original}
          </li>
          <li className="list-group-item list-group-item-primary">
            {i.translate.toString().split(",").join("/")}
          </li>
          <li className="list-group-item list-group-item-danger">
            {i?.answer}
          </li>
        </ul>
      ))}
      <p></p>
      <button
        className="rounded m-2"
        style={{
          background: "#E0E0E0",
          border: "0",
          padding: "3px 8px 3px 8px",
        }}
        onClick={goBack}>
        Go back to the library
      </button>
    </div>
  ) : (
    <>
      <p>Congratulations! You didn't make any mistakes</p>
      <button
        className="rounded m-2"
        style={{
          background: "#E0E0E0",
          border: "0",
          padding: "3px 8px 3px 8px",
        }}
        onClick={goBack}>
        Go back to the library
      </button>
    </>
  );
}
