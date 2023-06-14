import { useEffect, useState } from "react";
import userApi from "../../http";
import CommunityBlock from "./CommunityBlock";

export default function Community() {
  let [sets, setSets] = useState([]);
  useEffect(() => {
    userApi.post("/communityCards").then((res) => {
      setSets(res.data);
    });
  }, []);

  return (
    <div
      style={{
        overflow: "auto",
        maxHeight: "780px",
      }}>
      {sets.map((i) =>
        i.cards.map((c, index) => (
          <div key={index + "op"}>
            <CommunityBlock index={index} set={i} item={c} />
          </div>
        ))
      )}
    </div>
  );
}
