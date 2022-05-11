import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { countNot } from "../../store";

function Recent({ id }) {
  const [activities, setActivities] = useState([]);
  const [count, setCount] = useRecoilState(countNot);
  // const getRecent = async () => {
  //   await axios
  //     .get(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/getRecent/${id}`)
  //     .then((res) => {
  //       setActivities(res.data.updateFlags);
  //       setCount(res.data.updateFlags.length);
  //     });
  // };

  useEffect(() => {
    if (id) {
      // getRecent();
    }
  }, [id,count]);

  return (
    <>
      {Object.values(activities).map((a, i) => {
        return (
          <>
            Msg ID: <h2>{a._id}</h2>
            <h1>{a.lid}</h1>
            <h1>{a.msg}</h1>
          </>
        );
      })}
    </>
  );
}

export default Recent;
