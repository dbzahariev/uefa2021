import React from "react";
import rankingImg from "./rankingImg.svg";

export default function Ranking() {
  return (
    <div style={{ width: "100px", height: "100px" }}>
      <img
        src={rankingImg}
        alt="Separator"
        style={{
          height: 200,
          width: 200,
          objectFit: "fill",
          border: "1px solid black",
        }}
      />
    </div>
  );
}
