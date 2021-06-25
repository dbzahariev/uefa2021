import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { Button, Space, Table } from "antd";
import { translateTeamsName } from "../helpers/Translate";
import { useParams } from "react-router-dom";
import { MatchType } from "./AllMatches2";
import { selectedCompetition } from "../App";

const competitionsIds = {
  Uefa: 2018,
  Premier: 2021,
};

type OneRow = {
  key: string;
  name: string;
  playedGames: number | string;
  won: number | string;
  draw: number | string;
  lost: number | string;
  points: number | string;
  position: number;
  goalDifference: number | string;
};

type OneGroup = {
  name: string;
  table: OneRow[];
};

export default function Groups() {
  const [groups, setGroups] = useState<OneGroup[]>([]);
  const [matches, setMatches] = useState<MatchType[]>([]);

  const getAllMatches = () => {
    var config: AxiosRequestConfig = {
      method: "GET",
      url: `https://api.football-data.org/v2/competitions/${selectedCompetition}/matches`,
      headers: {
        "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
      },
    };

    axios(config)
      .then(function (response) {
        let data: MatchType[] = response.data.matches;
        data = data.slice(0, 55); // limit First 3
        let matches: MatchType[] = [];

        data.forEach((el: any, index) => {
          if (el.id === 325091) {
          }
          let score = el.score;

          const calcScore = (match: any) => {
            let res: {
              ht: number | undefined;
              at: number | undefined;
            } = { ht: undefined, at: undefined };

            let ht = score?.fullTime?.homeTeam;
            let at = score?.fullTime?.awayTeam;
            if (ht !== null) {
              res.ht = score?.fullTime?.homeTeam;
            }
            if (at !== null) {
              res.at = score?.fullTime?.awayTeam;
            }

            return res;
          };
          let calculatedScore = calcScore(el);

          let matchToAdd: MatchType = {
            number: index + 1,
            key: matches.length || 0,
            id: el.id,
            homeTeam: el.homeTeam,
            awayTeam: el.awayTeam,
            utcDate: el.utcDate,
            group: el.group || el.stage,
            winner: score?.winner || "",
            homeTeamScore: calculatedScore.ht,
            awayTeamScore: calculatedScore.at,
            status: el.status,
          };
          matches.push(matchToAdd);
        });
        setMatches(matches);
      })
      .catch((error) => console.error(error));
  };

  let params: any = useParams();

  useEffect(() => {
    if (matches.length > 0) {
      getAllStandings();
    }
    // eslint-disable-next-line
  }, [matches.length]);

  useEffect(() => {
    getAllMatches();
  }, []);

  const getNamesMatches = () => {
    let fullMatches = [...matches];

    fullMatches = fullMatches.filter(
      (match) => match.status === "IN_PLAY" || match.status === "PAUSED"
    );

    let namesMatches: string[] = [];
    fullMatches.forEach((match) => {
      let awayTeamName: string = match.awayTeam.name;
      let homeTeamName: string = match.homeTeam.name;

      if (
        awayTeamName &&
        namesMatches.findIndex((el) => el === awayTeamName) === -1
      )
        namesMatches.push(awayTeamName);
      if (
        homeTeamName &&
        namesMatches.findIndex((el) => el === homeTeamName) === -1
      )
        namesMatches.push(homeTeamName);
    });
    return namesMatches;
  };

  const getAllStandings = () => {
    var config: AxiosRequestConfig = {
      method: "GET",
      url: `https://api.football-data.org/v2/competitions/${competitionsIds.Uefa}/standings`,
      headers: {
        "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
      },
    };

    axios(config)
      .then(function (response) {
        let data: any = response.data.standings;
        let allGroups = [];

        for (let i = 0; i < data.length; i++) {
          let group = data[i];
          let groupToAdd: OneGroup = {
            name: group.group as string,
            table: [],
          };
          groupToAdd.name = groupToAdd.name[groupToAdd.name.length - 1];

          for (let j = 0; j < group.table.length; j++) {
            let teams = group.table[j];
            let teamsToAdd: OneRow = {
              key: teams.team.name,
              name: translateTeamsName(teams.team.name),
              playedGames: teams.playedGames,
              won: teams.won,
              draw: teams.draw,
              lost: teams.lost,
              points: teams.points,
              position: teams.position,
              goalDifference: teams.goalDifference,
            };
            groupToAdd.table.push(teamsToAdd);
          }

          groupToAdd = convertGroup(groupToAdd);
          allGroups.push(groupToAdd);
        }
        setGroups(allGroups);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    let groupName = params.groupName;
    if (groupName && groupName !== "All") {
      let el = document.getElementById(groupName);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    // eslint-disable-next-line
  }, [groups]);

  const convertGroup = (oneGroup: OneGroup) => {
    let result: OneGroup = { ...oneGroup };
    result.table.forEach((gamesInGroup) => {
      let finishedGame = [...getNamesMatches()].findIndex(
        (el) => el === gamesInGroup.key
      );
      if (finishedGame !== -1) {
        gamesInGroup.points = "?";
        gamesInGroup.draw = "?";
        gamesInGroup.playedGames = "?";
        gamesInGroup.goalDifference = "?";
        gamesInGroup.lost = "?";
        gamesInGroup.won = "?";
        gamesInGroup.name = "?";
      }
    });
    return result;
  };

  const renderGroups = () => {
    const oneGroupTable = (oneGroup: OneGroup) => {
      const columns = [
        {
          title: "Поз",
          dataIndex: "position",
          key: "position",
          render: (el: number) => (
            <span
              style={{
                border: `2px solid ${
                  el.toString() === "1" || el.toString() === "2"
                    ? "#4285F4"
                    : el.toString() === "3"
                    ? "#FA7B17"
                    : "black"
                }`,
              }}
            >
              {el}
            </span>
          ),
        },
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          width: window.screen.width * 0.2,
        },
        {
          title: "ИИ",
          dataIndex: "playedGames",
          key: "playedGames",
        },
        {
          title: "П",
          dataIndex: "won",
          key: "won",
        },
        {
          title: "Р",
          dataIndex: "draw",
          key: "draw",
        },
        {
          title: "З",
          dataIndex: "lost",
          key: "lost",
        },
        {
          title: "ГР",
          dataIndex: "goalDifference",
          key: "goalDifference",
        },
        {
          title: "Т",
          dataIndex: "points",
          key: "points",
        },
      ];
      return (
        <Table
          key={`Group ${oneGroup.name}`}
          title={() => (
            <p style={{ textAlign: "center" }}>{`Група ${oneGroup.name}`}</p>
          )}
          dataSource={oneGroup.table}
          columns={columns}
          pagination={false}
          bordered
        />
      );
    };

    return (
      <div>
        {groups.map((group) => {
          return (
            <div key={`Group ${group.name}`} id={`Group ${group.name}`}>
              <Space direction={"horizontal"}>{oneGroupTable(group)}</Space>
            </div>
          );
        })}
        <Button onClick={() => window.scrollTo(0, 0)}>Начало</Button>
      </div>
    );
  };

  return <div>{renderGroups()}</div>;
}
