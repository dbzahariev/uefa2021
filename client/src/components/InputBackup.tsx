import { Button, Input, Select, Space } from "antd";
import React, { useEffect, useState } from "react";

const { Option } = Select;

interface MatchFromBackup {
  number: number;
  key: number;
  id: number;
  homeTeam: {
    id: number;
    name: string;
  };
  awayTeam: {
    id: number;
    name: string;
  };
  utcDate: string;
  group: string;
  winner: string;
  homeTeamScore: number;
  awayTeamScore: number;
  status: string;
  score: {
    winner: string;
    duration: string;
    fullTime: {
      homeTeam: number;
      awayTeam: number;
    };
    halfTime: {
      homeTeam: number;
      awayTeam: number;
    };
    extraTime: {
      homeTeam: null;
      awayTeam: null;
    };
    penalties: {
      homeTeam: null;
      awayTeam: null;
    };
  };
}

interface inputType {
  number: number;
  otbor1: string;
  otbor2: string;
  date: string;
  group: string;
  homeTeamScore: number;
  awayTeamScore: number;
  winner: string;
}

export default function InputBackup() {
  const [input, setInput] = useState<inputType>({
    otbor1: "",
    otbor2: "",
    number: 0,
    date: new Date(`2018-06-16T12:00:00Z`).toUTCString(),
    group: "",
    homeTeamScore: -1,
    awayTeamScore: -1,
    winner: "",
  });

  // eslint-disable-next-line
  let kk: MatchFromBackup = {
    number: 1,
    key: 0,
    id: 201801,
    homeTeam: { id: 1, name: "Русия" },
    awayTeam: { id: 2, name: "Саудитска Арабия" },
    utcDate: "2018-06-14T15:00:00Z",
    group: "Group A",
    winner: "HOME_TEAM",
    homeTeamScore: 5,
    awayTeamScore: 0,
    status: "FINISHED",
    score: {
      winner: "HOME_TEAM",
      duration: "REGULAR",
      fullTime: { homeTeam: 5, awayTeam: 0 },
      halfTime: { homeTeam: 0, awayTeam: 0 },
      extraTime: { homeTeam: null, awayTeam: null },
      penalties: { homeTeam: null, awayTeam: null },
    },
  };

  // eslint-disable-next-line
  const [oneMatch, setOneMatch] = useState();

  // eslint-disable-next-line
  let teams = [
    { id: 1, name: "Русия" },
    { id: 2, name: "Саудитска Арабия" },
    { id: 3, name: "Уругвай" },
    { id: 4, name: "Египет" },
    { id: 5, name: "Уругвай" },
    { id: 6, name: "Египет" },
    { id: 7, name: "Уругвай" },
    { id: 8, name: "Египет" },
    { id: 9, name: "Уругвай" },
    { id: 10, name: "Египет" },
    { id: 11, name: "Мароко" },
    { id: 12, name: "Иран" },
    { id: 13, name: "Португалия" },
    { id: 14, name: "Испания" },
    { id: 15, name: "Франция" },
    { id: 16, name: "Австралия" },
    { id: 17, name: "Аржентина" },
    { id: 18, name: "Исландия" },
    { id: 19, name: "Перу" },
    { id: 20, name: "Дания" },
    { id: 21, name: "Хърватия" },
    { id: 22, name: "Нигерия" },
    { id: 23, name: "Коста Рика" },
    { id: 24, name: "Сърбия" },
    { id: 25, name: "Германия" },
    { id: 26, name: "Мексико" },
    { id: 27, name: "Бразилия" },
    { id: 28, name: "Швейцария" },
    { id: 29, name: "Швеция" },
    { id: 30, name: "Южна Корея" },
    { id: 31, name: "Белгия" },
    { id: 32, name: "Панама" },
    { id: 33, name: "Англия" },
    { id: 34, name: "Тунис" },
    { id: 35, name: "Колумбия" },
    { id: 36, name: "Япония" },
    { id: 37, name: "Полша" },
    { id: 38, name: "Сенегал" },
  ];

  // eslint-disable-next-line
  let winner = ["HOME_TEAM", "AWAY_TEAM", "DRAW"];

  useEffect(() => {
    const calcWinner = () => {
      let res = "HOME_TEAM";
      if (input.homeTeamScore > input.awayTeamScore) {
        res = "HOME_TEAM";
      } else if (input.homeTeamScore < input.awayTeamScore) {
        res = "AWAY_TEAM";
      } else res = "DRAW";

      return res;
    };
    setInput({ ...input, winner: calcWinner() });
    // eslint-disable-next-line
  }, [input.homeTeamScore, input.awayTeamScore]);

  const onChange = (value: string, field: string) => {
    if (field === "Otber 1") {
      setInput({ ...input, otbor1: value });
    } else if (field === "Otber 2") {
      setInput({ ...input, otbor2: value });
    } else if (field === "number") {
      setInput({ ...input, number: Number(value) });
    } else if (field === "date") {
      setInput({ ...input, date: value });
    } else if (field === "group") {
      setInput({ ...input, group: value });
    } else if (field === "homeTeamScore") {
      setInput({
        ...input,
        homeTeamScore: Number(value),
      });
    } else if (field === "awayTeamScore") {
      setInput({
        ...input,
        awayTeamScore: Number(value),
      });
    } else if (field === "winner") {
      setInput({ ...input, winner: value });
    } else {
      debugger;
      console.log("err", { value, field });
    }
  };

  useEffect(() => {}, [input]);

  const genRecord = () => {
    let kk1: MatchFromBackup = {
      number: input.number,
      key: input.number - 1,
      id: Number(`2018${input.number}`),
      homeTeam: { id: 1, name: input.otbor1 },
      awayTeam: { id: 2, name: input.otbor2 },
      utcDate: new Date(input.date).toUTCString(),
      group: input.group,
      winner: input.winner,
      homeTeamScore: input.homeTeamScore,
      awayTeamScore: input.awayTeamScore,
      status: "FINISHED",
      score: {
        winner: input.winner,
        duration: "REGULAR",
        fullTime: {
          homeTeam: input.homeTeamScore,
          awayTeam: input.awayTeamScore,
        },
        halfTime: { homeTeam: 0, awayTeam: 0 },
        extraTime: { homeTeam: null, awayTeam: null },
        penalties: { homeTeam: null, awayTeam: null },
      },
    };
    console.log(kk1);
    setInput({
      otbor1: "",
      otbor2: "",
      number: kk1.number + 1,
      date: new Date(`2018-06-16T12:00:00Z`).toUTCString(),
      group: "",
      homeTeamScore: -1,
      awayTeamScore: -1,
      winner: "",
    });
  };

  return (
    <div>
      <Input
        placeholder="date"
        value={input.date.toString()}
        onChange={(ev) => {
          onChange(ev.target.value, "date");
        }}
      />
      <Space direction="horizontal">
        <Input
          placeholder="number"
          value={input.number}
          onChange={(ev) => {
            onChange(ev.target.value, "number");
          }}
        />

        <Input
          placeholder="Otbor 1"
          value={input.otbor1}
          onChange={(ev) => {
            onChange(ev.target.value, "Otber 1");
          }}
        />
        <Input
          placeholder="Otbor 2"
          value={input.otbor2}
          onChange={(ev) => {
            onChange(ev.target.value, "Otber 2");
          }}
        />
        <Input
          placeholder="group"
          value={input.group}
          onChange={(ev) => {
            onChange(ev.target.value, "group");
          }}
        />
        <Input
          placeholder="homeTeamScore"
          value={input.homeTeamScore}
          onChange={(ev) => {
            onChange(ev.target.value, "homeTeamScore");
          }}
        />
        <Input
          placeholder="awayTeamScore"
          value={input.awayTeamScore}
          onChange={(ev) => {
            onChange(ev.target.value, "awayTeamScore");
          }}
        />
        <Select
          style={{
            marginLeft: 20,
            width: "240px",
            marginTop: 10,
            marginBottom: 10,
          }}
          value={input.winner}
          onChange={(value: any) => {
            onChange(value, "winner");
          }}
        >
          <Option value="">Отбор</Option>
          {winner.map((el) => {
            return (
              <Option key={el} value={el}>
                {el}
              </Option>
            );
          })}
        </Select>
      </Space>
      <Button onClick={genRecord}>Gen</Button>
    </div>
  );
}
