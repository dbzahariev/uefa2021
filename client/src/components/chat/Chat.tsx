import { Button, notification, Select, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { UsersType } from "../AllMatches2";
import OneMessage, { MessageType } from "./OneMessage";
import $ from "jquery";

const { Option } = Select;

interface MessageTypeFoeChat {
  date: Date;
  message: String;
}

interface ChatType {
  messages: MessageTypeFoeChat[];
  user: string;
  __v: number;
  _id: string;
}

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
  let AutoRefreshInterval: number = Number(
    process.env.SECONDSAUTORELOADCHAT || 5
  );
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  let intervalRef = useRef<any>();

  useEffect(() => {
    if (AutoRefreshInterval >= 1) {
      intervalRef.current = setInterval(() => {
        getChats();
      }, AutoRefreshInterval * 1000);
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [AutoRefreshInterval]);

  useEffect(() => {
    getAllUsersNames();

    const updateWindowDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
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
    console.log(`selected ${value}`);
    setNewMsg({ ...newMsg, user: value });
    if (chats.findIndex((el) => el.user === value) === -1) {
      createUser(value);
    }
  };

  useEffect(() => {
    if (chats.length > 0) {
      let newMsgs: MessageType[] = [];
      chats.forEach((ch) => {
        ch.messages.forEach((msg) => {
          newMsgs.push({ user: ch.user, date: msg.date, message: msg.message });
        });
      });
      newMsgs = newMsgs.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setMassages(newMsgs);
    }
  }, [chats]);

  useEffect(() => {
    if ($("#ChatBox") !== undefined) {
      if ($("#ChatBox")[0] !== undefined) {
        $("#ChatBox").scrollTop($("#ChatBox")[0].scrollHeight);
      }
    }
  }, [massages]);

  const createUser = (username: string) => {
    axios({
      method: "POST",
      data: { user: username, messages: [] },
      withCredentials: true,
      url: "/chat/save",
    })
      .then((res) => {
        console.log("ffff", res);
      })
      .catch((err) => {});
  };

  const getChats = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "/chat",
    })
      .then((res) => setChats(res.data))
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
        { message: message, date: date },
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
    let newValue = foo1.target.value;
    setNewMsg({ ...newMsg, message: newValue, date: new Date() });
  };

  const oneChat = (message: MessageType, index: number) => {
    return (
      <OneMessage
        key={index}
        index={index}
        message={message}
        fullUsers={fullUsers}
      />
    );
  };

  if ($("#ChatBox") !== undefined) {
    if ($("#ChatBox")[0] !== undefined) {
      $("#ChatBox").scrollTop($("#ChatBox")[0].scrollHeight);
    }
  }

  const checkMobile = () => {
    return navigator.maxTouchPoints > 0;
  };
  return (
    <div style={{ margin: 10 }}>
      <Select
        style={{
          marginLeft: 20,
          width: "140px",
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
            ? dimensions.height * 0.6
            : dimensions.height * 0.75,
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
              ? dimensions.width * 0.88
              : dimensions.width * 0.86,
          }}
          rows={3}
          placeholder="Съобщение"
          onChange={onInput}
          value={newMsg.message}
        />
        <Button
          type="primary"
          onClick={sendMsg}
          style={{
            borderRadius: 15,
          }}
        >
          Изпрати съобщение
        </Button>
      </Space>
    </div>
  );
}
