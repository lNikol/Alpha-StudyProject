import { Link, useNavigate } from "react-router-dom";

export default function UnsuccessList({ unsuccessCards, setShow }) {
  const navigate = useNavigate();
  const goBack = () => {
    setShow(false);
    navigate("/");
  };
  return unsuccessCards?.length >= 1 ? (
    <div>
      {unsuccessCards.map((i, index) => (
        <div
          key={index + "]"}
          style={{ display: "inline-block", margin: "5px", minWidth: "150px" }}>
          <b className="original" style={{ color: "green" }}>
            {i.original}
          </b>{" "}
          -{" "}
          <i className="translate" style={{ color: "gray" }}>
            {i.translate}
          </i>{" "}
          - <u style={{ color: "red" }}>{i?.answer}</u>
        </div>
      ))}
      <p></p>
      <button onClick={goBack}>Go back to the home page</button>
    </div>
  ) : (
    <>
      <p>Congratulations! You didn't make any mistakes</p>
      <button onClick={goBack}>Go back to the home page</button>
    </>
  );
}
