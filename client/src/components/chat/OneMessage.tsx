import { Button } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Key, useEffect, useState } from "react";
import { UsersType } from "../AllMatches2";
import { checkMobile } from "./Chat";

export interface MessageType {
  user: string;
  date: Date;
  message: String;
}

export default function OneMessage({
  message,
  index,
  fullUsers,
  editMessage,
}: {
  message: MessageType;
  index: Key;
  fullUsers: UsersType[];
  editMessage: Function;
}) {
  let selUser = fullUsers.find((el) => el.name === message.user);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const updateWindowDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", updateWindowDimensions);
  }, []);

  const [isEdit, setIsEdit] = useState(false);
  const [newMessage, setNewMessage] = useState(message.message as string);

  const enableEdit = () => {
    setIsEdit(!isEdit);
    if (isEdit) {
      editMessage(newMessage, message);
    }
  };
  const remove = () => {};
  const changeMes = (foo1: any) => {
    let fff = foo1.target.value;
    setNewMessage(fff);
  };

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "red",
          float: "right",
          height: "200%",
        }}
      >
        <Button onClick={enableEdit}>Редактиране</Button>
        <Button onClick={remove}>Премахване</Button>
      </div>
      <div>
        <div>
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
        {isEdit ? (
          <TextArea
            style={{
              margin: 10,
              borderRadius: 15,
              width: checkMobile()
                ? dimensions.width * 0.88
                : dimensions.width * 0.86,
            }}
            rows={3}
            placeholder="Съобщение"
            onChange={changeMes}
            value={newMessage}
          />
        ) : (
          <span>{message.message}</span>
        )}
      </div>
    </div>
  );
}
