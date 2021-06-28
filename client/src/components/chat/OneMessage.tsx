import { Button, Popconfirm, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Key, useEffect, useState } from "react";
import { UsersType } from "../../helpers/OtherHelpers";
import { checkMobile, returnedEmojiText } from "./Chat";

export interface MessageType {
  user: string;
  date: Date;
  message: String;
  likes?: any[];
}

export default function OneMessage({
  message,
  index,
  fullUsers,
  editMessage,
  removeMessage,
  likeMessage,
  selectedUser,
}: {
  message: MessageType;
  index: Key;
  fullUsers: UsersType[];
  editMessage: Function;
  removeMessage: Function;
  likeMessage: Function;
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

  const like = () => {
    console.log("ok");
    likeMessage(message.user, message, ifLiked());
  };

  const ifLiked = () => {
    let res = false;
    let kk = message;
    if (kk?.likes !== undefined) {
      kk.likes.forEach((like) => {
        let foo = selectedUser;
        if (foo.length > 0) {
          if (like === foo) {
            res = true;
          }
        }
      });
    }
    return res;
  };
  const getColorLiked = () => {
    let res = ifLiked() ? "silver" : "red";
    return res;
  };

  const getLikedText = () => {
    let res = ifLiked() ? "Отмяна харесване" : "Харесване 👍";

    let likedFrom = "(";

    let kk = message;
    if (kk?.likes !== undefined && kk.likes.length > 0) {
      kk.likes.sort();
      likedFrom += kk.likes.join(", ");
    }

    likedFrom += ")";
    if (likedFrom !== "()") {
      res += ` ${likedFrom}`;
    }
    return res;
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
        direction={checkMobile() ? "vertical" : "horizontal"}
        style={{
          display: "flex",
          // alignItems: "center",
          // justifyContent: "center",
          float: checkMobile() ? "left" : "right",
          height: "200%",
        }}
      >
        <Button
          type={"link"}
          disabled={selectedUser.length === 0}
          style={{
            color: getColorLiked(),
          }}
          onClick={like}
        >
          {getLikedText()}
        </Button>
        <Space direction={"horizontal"}>
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
        </Space>
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
