import { Button, notification, Select, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import OneMessage, { MessageType } from "./OneMessage";
import $ from "jquery";
import EmojiPopup from "./EmojiPopup";
import { UsersType } from "../../helpers/OtherHelpers";

const { Option } = Select;

interface MessageTypeFoeChat {
  date: Date;
  message: String;
  likes: any[];
}

interface ChatType {
  messages: MessageTypeFoeChat[];
  user: string;
  __v: number;
  _id: string;
}

export const returnedEmojiText = (text: string) => {
  let res = text + "";

  res = res.replaceAll(":)", "😊");
  res = res.replaceAll(":D", "😄");
  res = res.replaceAll(":d", "😄");
  res = res.replaceAll(":(", "🙁");
  res = res.replaceAll(":'(", "😢");
  res = res.replaceAll(";(", "😢");
  res = res.replaceAll(":')", "😂");
  res = res.replaceAll(";)", "😂");
  res = res.replaceAll(":о", "😮");
  res = res.replaceAll(":О", "😮");
  res = res.replaceAll(":0", "😮");
  res = res.replaceAll(":*", "😘");
  res = res.replaceAll(";)", "😉");
  res = res.replaceAll(":P", "😛");
  res = res.replaceAll(":p", "😛");
  res = res.replaceAll(":|", "😐");
  res = res.replaceAll(":$", "😳");
  res = res.replaceAll(":shame", "😳");
  res = res.replaceAll(":shame:", "😳");
  res = res.replaceAll("</3", "💔");
  res = res.replaceAll("<\\3", "💔");
  res = res.replaceAll("<3", "❤️");
  res = res.replaceAll(":ball", "⚽️");
  res = res.replaceAll(":ball:", "⚽️");
  res = res.replaceAll(":see_no_evil", "🙈");
  res = res.replaceAll(":see_no_evil:", "🙈");
  res = res.replaceAll(":hear_no_evil", "🙉");
  res = res.replaceAll(":hear_no_evil:", "🙉");
  res = res.replaceAll(":speak_no_evil", "🙊");
  res = res.replaceAll(":speak_no_evil:", "🙊");

  return res;
};

const AutoRefreshInterval = 2;
export const checkMobile = () => {
  return navigator.maxTouchPoints > 0;
};

export default function Chat() {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [massages, setMassages] = useState<MessageType[]>([]);
  const [usersNames, setUsersNames] = useState<string[]>([]);
  const [fullUsers, setFullUsers] = useState<UsersType[]>([]);
  const [newMsg, setNewMsg] = useState({
    user: "",
    message: "",
    date: new Date(),
  });

  const [dimensions, setDimensions] = useState({
    widthI: window.innerWidth,
    heightI: window.innerHeight,
    widthO: window.outerWidth,
    heightO: window.outerHeight,
  });

  let intervalRef = useRef<any>();

  useEffect(() => {
    if (AutoRefreshInterval >= 1) {
      intervalRef.current = setInterval(() => {
        getChats();
        getMesses();
      }, AutoRefreshInterval * 1000);
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [AutoRefreshInterval]);

  useEffect(() => {
    getAllUsersNames();

    const updateWindowDimensions = () => {
      setDimensions({
        widthI: window.innerWidth,
        heightI: window.innerWidth,
        widthO: window.outerWidth,
        heightO: window.outerWidth,
      });
    };

    window.addEventListener("resize", updateWindowDimensions);
  }, []);

  const getAllUsersNames = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "/api",
    })
      .then((res) => {
        let users = [...res.data] as UsersType[];
        let newUsers: string[] = [];
        users.forEach((el) => {
          newUsers.push(el.name);
        });

        // newUsers.sort((a, b) => a.index - b.index);

        setUsersNames(newUsers);
        setFullUsers(users);
      })
      .catch((err) => {});
  };

  const handleChangeForSelector = (value: any) => {
    setNewMsg({ ...newMsg, user: value });
    if (chats.findIndex((el) => el.user === value) === -1) {
      createUser(value);
    }
  };

  useEffect(() => {
    getMesses();
    // eslint-disable-next-line
  }, [chats]);

  const getMesses = () => {
    if (chats.length > 0) {
      let newMsgs: MessageType[] = [];
      chats.forEach((ch) => {
        ch.messages.forEach((msg) => {
          newMsgs.push({
            user: ch.user,
            date: msg.date,
            message: msg.message,
            likes: msg.likes,
          });
        });
      });
      newMsgs = newMsgs.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setMassages(newMsgs);
    }
  };

  useEffect(() => {
    if ($("#ChatBox") !== undefined) {
      if ($("#ChatBox")[0] !== undefined) {
        $("#ChatBox").scrollTop($("#ChatBox")[0].scrollHeight);
      }
    }
  }, [massages.length]);

  const createUser = (username: string) => {
    axios({
      method: "POST",
      data: { user: username, messages: [] },
      withCredentials: true,
      url: "/chat/save",
    })
      .then((res) => {})
      .catch((err) => console.error(err));
  };

  const getChats = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "/chat",
    })
      .then((res) => {
        setChats(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getChats();
  }, []);

  const sendMsg = () => {
    if (newMsg.user.length === 0) {
      notification.open({
        message: `Няма избран играч!`,
        type: "error",
      });
      return;
    }
    if (newMsg.message.length === 0) {
      notification.open({
        message: `Няма написано съобщение!`,
        type: "error",
      });
      return;
    }

    addMessage(newMsg);
    setNewMsg({ ...newMsg, message: "" });
  };

  const addMessage = ({
    user,
    message,
    date,
  }: {
    user: String;
    message: String;
    date: Date;
  }) => {
    let oldMyMsgs: ChatType[] = chats.filter((el) => el.user === user);
    if (oldMyMsgs.length > 0) {
      let oldMyMsgs2 = oldMyMsgs[0];

      let newMessages: MessageTypeFoeChat[] = [
        ...oldMyMsgs2.messages,
        { message: message, date: date, likes: [] },
      ];

      axios({
        method: "POST",
        data: { messages: newMessages },
        withCredentials: true,
        url: `/chat/update?id=${user}`,
      })
        .then((res) => {
          getChats();
        })
        .catch((err) => {
          notification.open({
            message: `Грешка`,
            type: "error",
          });
          return console.error(err);
        });
    } else {
      notification.open({
        message: `Няма намерен потребител`,
        type: "error",
      });
    }
  };

  const onInput = (foo1: any) => {
    let newValue = returnedEmojiText(foo1.target.value);

    setNewMsg({ ...newMsg, message: newValue, date: new Date() });
  };

  const editMessage = (newMessage: String, oldMessage: MessageType) => {
    let user = oldMessage.user;
    let oldMyMsgs: ChatType[] = chats.filter((el) => el.user === user);
    let oldMyMsgs2 = oldMyMsgs[0];
    let newMessages: MessageTypeFoeChat[] = [...oldMyMsgs2.messages];
    for (let i = 0; i < newMessages.length; i++) {
      if (newMessages[i].date === oldMessage.date) {
        newMessages[i].message = newMessage;
        break;
      }
    }
    axios({
      method: "POST",
      data: { messages: newMessages },
      withCredentials: true,
      url: `/chat/update?id=${user}`,
    }).then(() => {
      getChats();
      getMesses();
    });
  };

  const likeMessage = (
    newMessage: String,
    oldMessage: MessageType,
    isLike: boolean
  ) => {
    let user = oldMessage.user;
    let selectedUser = newMsg.user;
    let oldMyMsgs: ChatType[] = chats.filter((el) => el.user === user);
    let oldMyMsgs2 = oldMyMsgs[0];
    let newMessages: MessageTypeFoeChat[] = [...oldMyMsgs2.messages];
    for (let i = 0; i < newMessages.length; i++) {
      if (newMessages[i].date === oldMessage.date) {
        if (isLike) {
          newMessages[i].likes = (newMessages[i].likes || []).filter(
            (el) => el !== selectedUser
          );
        } else {
          newMessages[i].likes = [
            ...(newMessages[i].likes || []),
            selectedUser,
          ];
        }
      }
    }
    axios({
      method: "POST",
      data: { messages: newMessages },
      withCredentials: true,
      url: `/chat/update?id=${user}`,
    }).then(() => {
      getChats();
      getMesses();
    });
  };

  const removeMessage = (message: MessageType) => {
    let newMessages = chats.filter((el) => el.user === message.user).slice()[0];
    newMessages.messages = newMessages.messages.filter(
      (msg) => msg.message !== message.message && msg.date !== message.date
    );

    axios({
      method: "POST",
      data: { messages: newMessages.messages },
      withCredentials: true,
      url: `/chat/update?id=${message.user}`,
    }).then(() => {
      getChats();
      getMesses();
    });
  };

  const oneChat = (message: MessageType, index: number) => {
    let selectedUser = newMsg.user;

    return (
      <OneMessage
        key={index}
        index={index}
        message={message}
        fullUsers={fullUsers}
        editMessage={editMessage}
        removeMessage={removeMessage}
        likeMessage={likeMessage}
        selectedUser={selectedUser}
      />
    );
  };

  return (
    <div style={{ margin: 10, width: `${window.innerWidth * 0.98}px` }}>
      <Select
        style={{
          marginLeft: 20,
          width: "240px",
          marginTop: 10,
          marginBottom: 10,
        }}
        defaultValue={"Избери играч"}
        onChange={handleChangeForSelector}
      >
        <Option value="">Избери играч</Option>
        {usersNames.map((user) => {
          return (
            <Option key={user} value={user}>
              {user}
            </Option>
          );
        })}
      </Select>

      <div
        id={"ChatBox"}
        style={{
          border: "3px solid black",
          overflowY: "scroll",
          borderRadius: 15,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          height: checkMobile()
            ? dimensions.heightI * 0.6
            : dimensions.heightI * 0.68,
        }}
      >
        {massages.map((message, index: number) => oneChat(message, index))}
      </div>
      <Space
        direction={checkMobile() ? "vertical" : "horizontal"}
        size={"small"}
      >
        <TextArea
          style={{
            margin: 10,
            borderRadius: 15,
            width: checkMobile()
              ? dimensions.widthI * 0.9
              : dimensions.widthI * 0.869,
          }}
          rows={3}
          placeholder="Съобщение"
          onChange={onInput}
          value={newMsg.message}
          autoSize
        />
        <Button
          disabled={newMsg.user.length === 0}
          type="primary"
          onClick={sendMsg}
          style={{
            borderRadius: 15,
          }}
        >
          Изпрати съобщение
        </Button>
      </Space>
      <EmojiPopup
        onSelectEmoji={(emoji: string) => {
          let val = checkMobile()
            ? dimensions.heightI * 1.1
            : dimensions.heightI * 0.65;

          $("#ChatBox").height(val);

          newMsg.message += emoji;
        }}
      />
    </div>
  );
}
