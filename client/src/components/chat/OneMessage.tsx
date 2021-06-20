import { Button, Popconfirm, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Key, useEffect, useState } from "react";
import { UsersType } from "../AllMatches2";
import { checkMobile, returnedEmojiText } from "./Chat";
import EmojiPopup from "./EmojiPopup";
import $ from "jquery";

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
  removeMessage,
  selectedUser,
}: {
  message: MessageType;
  index: Key;
  fullUsers: UsersType[];
  editMessage: Function;
  removeMessage: Function;
  selectedUser: string;
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
  const [newMessage, setNewMessage] = useState(
    returnedEmojiText(message.message as string)
  );

  const enableEdit = () => {
    setIsEdit(!isEdit);
    if (isEdit) {
      editMessage(newMessage, message);
    }
  };

  return (
    <div
      key={index}
      style={{
        background: "hsl(0, 0%, 95%)",
        margin: 10,
        padding: 5,
        fontSize: 18,
        borderRadius: 5,
      }}
    >
      <Space
        direction={"horizontal"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          float: checkMobile() ? "left" : "right",
          height: "200%",
        }}
      >
        <Button onClick={enableEdit} disabled={selectedUser !== message.user}>
          Редактиране
        </Button>

        <Popconfirm
          title="Потвърждаване"
          icon={false}
          onConfirm={() => removeMessage(message)}
          onCancel={() => {}}
          okText="Да"
          cancelText="Не"
        >
          <Button disabled={selectedUser !== message.user}>Премахване</Button>
        </Popconfirm>
        <EmojiPopup
          disabled={!isEdit}
          onSelectEmoji={(emoji: string) => {
            let val = checkMobile()
              ? dimensions.height * 1.1
              : dimensions.height * 0.65;

            $("#ChatBox").height(val);

            let ffff = $("#inputText").prop("selectionStart");

            let newMsg =
              newMessage.slice(0, ffff) + emoji + newMessage.slice(ffff);
            // debugger;

            setNewMessage(returnedEmojiText(newMsg));
          }}
        />
      </Space>
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
            id={"inputText"}
            autoSize
            style={{
              margin: 10,
              borderRadius: 15,
              width: checkMobile()
                ? dimensions.width * 0.88
                : dimensions.width * 0.86,
            }}
            rows={3}
            placeholder="Съобщение"
            onChange={(ev) => setNewMessage(returnedEmojiText(ev.target.value))}
            value={newMessage}
          />
        ) : (
          <span>{returnedEmojiText(message.message as string)}</span>
        )}
      </div>
    </div>
  );
}
