import { useEffect, useState } from "react";
import userApi from "../../http";

export default function Community() {
  let [cards, setCards] = useState([]);
  useEffect(() => {
    userApi.post("/communityCards").then((res) => console.log(res.data));
  }, []);
  return <></>;
}
