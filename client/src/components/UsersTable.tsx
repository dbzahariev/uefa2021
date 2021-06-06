import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import { translateTeamsName } from "../helpers/Translate";
import axios, { AxiosRequestConfig } from "axios";
import { competitionsIds } from "../App";

interface MatchType {
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
  utcDate: Date;
  group: string;
  score?: {
    duration: string;
    extraTime: {
      homeTeam: null;
      awayTeam: null;
    };
    fullTime: {
      homeTeam: number;
      awayTeam: number;
    };
    halfTime: {
      homeTeam: number;
      awayTeam: number;
    };
    penalties: {
      homeTeam: null;
      awayTeam: null;
    };
    winner: string;
  };
  winner?: string;
  homeTeamScore?: number;
  awayTeamScore?: number;
}

export default function UsersTable() {
  const [matches, setMatches] = useState<MatchType[]>([]);

  useEffect(() => {
    getAllMatches();
  }, []);

  const getAllMatches = () => {
    var config: AxiosRequestConfig = {
      method: "GET",
      url: `https://api.football-data.org/v2/competitions/${competitionsIds.Uefa}/matches`,
      headers: {
        "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
      },
    };

    axios(config)
      .then(function (response) {
        let data: MatchType[] = response.data.matches;
        // data = data.slice(0, 3); // limit First 3
        let matches: MatchType[] = [];

        data.forEach((el: MatchType, index) => {
          let score = el.score;
          let matchToAdd: MatchType = {
            number: index + 1,
            key: el.id,
            id: el.id,
            homeTeam: el.homeTeam,
            awayTeam: el.awayTeam,
            utcDate: el.utcDate,
            group: el.group,
            winner: score?.winner,
            homeTeamScore: score?.fullTime?.homeTeam,
            awayTeamScore: score?.fullTime?.awayTeam,
          };
          matches.push(matchToAdd);
        });
        setMatches(matches);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const oneUserTable = (oneMatch: MatchType[]) => {
    const columns = [
      {
        title: "Н",
        dataIndex: "number",
        key: "number",
        render: (el: number) => {
          return <span>{el}</span>;
        },
      },
      {
        title: "Поз",
        dataIndex: "homeTeam",
        key: "homeTeam",
        render: (el: { id: number; name: string }) => {
          return <span>{translateTeamsName(el.name) || "Ще се реши"}</span>;
        },
      },
      {
        title: "Р 1",
        dataIndex: "homeTeamScore",
        key: "homeTeamScore",
        render: (el: number) => {
          return <span>{el}</span>;
        },
      },
      {
        title: "Р 2",
        dataIndex: "awayTeamScore",
        key: "awayTeamScore",
        render: (el: number) => {
          return <span>{el}</span>;
        },
      },
      {
        title: "П",
        dataIndex: "winner",
        key: "winner",
        render: (el: string) => {
          let code = "";
          if (el === "HOME_TEAM") {
            code = "1";
          } else if (el === "AWAY_TEAM") {
            code = "2";
          } else if (el === "DRAW") {
            code = "Равен";
          }
          return <span>{code}</span>;
        },
      },
      {
        title: "Поз",
        dataIndex: "awayTeam",
        key: "awayTeam",
        render: (el: { id: number; name: string }) => {
          return <span>{translateTeamsName(el.name) || "Ще се реши"}</span>;
        },
      },
    ];

    return (
      <Table
        key={matches[0].id}
        dataSource={oneMatch}
        columns={columns}
        pagination={false}
        bordered
      />
    );
  };

  if (matches.length === 0) {
    return null;
  }

  return (
    <>
      <Space direction={"horizontal"}>{oneUserTable(matches)}</Space>
    </>
  );
}
