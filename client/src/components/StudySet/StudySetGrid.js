import { Link } from "react-router-dom";
import StudySet from "./StudySet";

export default function StudySetGrid({ studySets, user }) {
  return (
    <>
      {studySets.length == 0 ? (
        <StudySet key={0 + "asd"} name={""} cards={[]} num={0} user={user} />
      ) : (
        ""
      )}
      {studySets.map((i, index) => (
        // <Link to={`/studysets/${i.name}`}>
        <StudySet key={i.name + index} {...i} num={index} user={user} />
        // </Link>
      ))}
    </>
  );
}
