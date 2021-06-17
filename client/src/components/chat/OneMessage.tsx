import React, { Key } from "react";
import { UsersType } from "../AllMatches2";

export interface MessageType {
  user: string;
  date: Date;
  message: String;
}

export default function OneMessage({
  message,
  index,
  fullUsers,
}: {
  message: MessageType;
  index: Key;
  fullUsers: UsersType[];
}) {
  let selUser = fullUsers.find((el) => el.name === message.user);

  return (
    <div
      key={index}
      style={{
        background: "hsl(0, 0%, 95%)",
        margin: 10,
        padding: 5,
        fontSize: 18,
      }}
    >
      <div style={{}}>
        <span style={{ color: "hsl(360, 100%, 67%)" }}>{`(${new Date(
          message.date
        ).toLocaleString("bg-bg")}) `}</span>
        <span
          style={{
            color: `hsl(${selUser?.colorTable || "50"}, 100%, 50%)`,
          }}
        >
          {message.user}
        </span>
        <span>{": "}</span>
      </div>
      <span>{message.message}</span>
    </div>
  );
}
