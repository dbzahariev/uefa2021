import { Input, notification, Space, Table } from "antd";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import axios, { AxiosRequestConfig } from "axios";
import { Key, useEffect, useRef, useState } from "react";
import { selectedCompetition } from "../App";
import { translateTeamsName } from "../helpers/Translate";
import AutoRefresh, { AutoRefreshInterval } from "./AutoRefresh";

export interface MatchType {
  number: number;
  key: Key;
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

export interface UsersType {
  name: string;
  bets: {
    matchId: number;
    homeTeamScore: number;
    awayTeamScore: number;
    winner: string;
    point: number;
  }[];
  _id?: string;
  id?: string;
  totalPoints?: number;
}

export const renderP = (el: string) => {
  let result = "";
  if (el === "HOME_TEAM") {
    result = "1";
  } else if (el === "AWAY_TEAM") {
    result = "2";
  } else if (el === "DRAW") {
    result = "Р";
  }
  return <span>{result}</span>;
};

export default function AllMatches({ refresh }: { refresh: Function }) {
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [users, setUsers] = useState<UsersType[]>([]);

  let intervalRef = useRef<any>();

  useEffect(() => {
    if (AutoRefreshInterval >= 1 && AutoRefreshInterval !== "disable") {
      intervalRef.current = setInterval(() => {
        getAllMatches();
        getAllUsers();
      }, AutoRefreshInterval * 1000);
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [AutoRefreshInterval]);

  useEffect(() => {
    if (matches.length === 0) {
      getAllMatches();
    }
  }, [matches.length]);

  useEffect(() => {
    getAllUsers();
  }, []);

  const setBetsToDB = (userProp: UsersType) => {
    if (userProp) {
      let user = userProp;
      axios({
        method: "POST",
        data: { bets: user.bets },
        withCredentials: true,
        url: `/api/update?id=${user.id}`,
      })
        .then((res) => {
          notification.open({
            message: `Залогът е записан успешно!`,
            type: "success",
          });
        })
        .catch((err) => {
          notification.open({
            message: `Грешка`,
            type: "error",
          });
          return console.error(err);
        });
    }
  };

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
        data = data.slice(0, 3); // limit First 3
        let matches: MatchType[] = [];

        data.forEach((el: MatchType, index) => {
          let score = el.score;
          let matchToAdd: MatchType = {
            number: index + 1,
            key: matches.length || 0,
            id: el.id,
            homeTeam: el.homeTeam,
            awayTeam: el.awayTeam,
            utcDate: el.utcDate,
            group: el.group,
            winner: score?.winner || "",
            homeTeamScore: score?.fullTime?.homeTeam || 0,
            awayTeamScore: score?.fullTime?.awayTeam || 0,
          };
          matches.push(matchToAdd);
        });
        setMatches(matches);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getAllUsers = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "/api",
    })
      .then((res) => {
        let users = [...res.data] as UsersType[];
        let newUsers: UsersType[] = [];
        users.forEach((el) => {
          let userToAdd: UsersType = {
            name: el.name,
            bets: el.bets,
          };
          if (el._id) {
            userToAdd.id = el._id;
          }
          newUsers.push(userToAdd);
        });

        setUsers(newUsers);
      })
      .catch((err) => {});
  };

  const calcWinner = (homeScore: number, awayScore: number) => {
    let res: string = "";
    if (homeScore > awayScore) {
      res = "HOME_TEAM";
    } else if (awayScore > homeScore) {
      res = "AWAY_TEAM";
    } else {
      res = "DRAW";
    }
    return res;
  };

  const getValue = (
    user: UsersType,
    type: "homeTeamScore" | "awayTeamScore",
    fullMatch: MatchType
  ) => {
    let selectedMatch = user.bets.find((el) => el.matchId === fullMatch.id);
    if (selectedMatch) return selectedMatch[type];
    else return "";
  };

  const handleChange = (
    el1: any,
    user: UsersType,
    fullMatch: MatchType,
    type: "homeTeamScore" | "awayTeamScore"
  ) => {
    let newValue = el1.target.value;
    let newUsers = [...users];
    let curUser = newUsers.find((userSel) => userSel.name === user.name);

    if (!curUser) return null;

    let bet = curUser.bets.find((el) => el.matchId === fullMatch.id);

    if (!bet) {
      let newBet = {
        matchId: fullMatch.id,
        homeTeamScore: 0,
        awayTeamScore: 0,
        winner: "DRAW",
        [type]: Number(newValue),
        point: 0,
      };
      newBet.winner = calcWinner(newBet.homeTeamScore, newBet.awayTeamScore);
      bet = newBet;

      curUser.bets.push(newBet);
    } else {
      bet[type] = Number(newValue);
      bet.winner = calcWinner(bet.homeTeamScore, bet.awayTeamScore);
    }

    setUsers(newUsers);

    setBetsToDB(user);
  };

  const renderColumnForUser = (
    el: any,
    fullMatch: MatchType,
    user: UsersType,
    type: "homeTeamScore" | "awayTeamScore"
  ) => {
    return (
      <Input
        placeholder=""
        defaultValue={el}
        value={getValue(user, type, fullMatch)}
        onChange={(el) => handleChange(el, user, fullMatch, type)}
      />
    );
  };

  const getPointForEvent = (selectedMatch: MatchType, user: UsersType) => {
    let bet = user.bets.find((el) => el.matchId === selectedMatch.id);
    let res = 0;
    if (bet) {
      if (
        selectedMatch.winner === bet.winner &&
        selectedMatch.homeTeamScore === bet.homeTeamScore &&
        selectedMatch.awayTeamScore === bet.awayTeamScore
      ) {
        res = 3;
      } else if (selectedMatch.winner === bet.winner) {
        res = 1;
      }
    }
    return res;
  };

  const getPoints = (user: UsersType, match: MatchType) => {
    let res = { current: 5, total: 7 };
    res.current = getPointForEvent(match, user);

    let dd = user.bets.find((el) => el.matchId === match.id);
    if (dd) {
      dd.point = res.current;
    }
    let ttp = 0;
    for (let i = 0; i < user.bets.length; i++) {
      let cBet = user.bets[i];
      ttp += cBet.point;
      if (cBet.matchId === match.id) {
        break;
      }
    }
    res.total = ttp;

    // user.bets.forEach((el) => {
    //   ttp += el.point;
    // });
    // res.total = ttp;

    // if (user.totalPoints) {
    //   user.totalPoints += res.current;
    // } else {
    //   user.totalPoints = res.current;
    // }

    // res.total = user.totalPoints;

    return res;
  };

  const oneMatchTable = (AllMatches: MatchType[]) => {
    let windowHeight = window.innerHeight;
    let columnWidth = 200;

    return (
      <Table
        dataSource={AllMatches}
        pagination={false}
        bordered
        scroll={{ y: windowHeight * 0.77 }}
        expandable={{
          expandedRowRender: (record: MatchType) => {
            let date = new Date(record.utcDate).toLocaleString("bg-bg");
            return (
              <p style={{ margin: 0 }}>{`Този мач ще се проведе на ${date}`}</p>
            );
          },
          rowExpandable: () => true,
          defaultExpandedRowKeys: ["1"],
        }}
      >
        <Column title="Н" dataIndex="number" key="number" width={56} />
        <Column
          title="Домакин"
          dataIndex="homeTeam"
          key="homeTeam"
          width={columnWidth}
          render={(el: any) => (
            <span>{translateTeamsName(el.name) || "Ще се реши"}</span>
          )}
        />
        <ColumnGroup title="Резултат">
          <Column
            title="1"
            dataIndex="homeTeamScore"
            key="homeTeamScore"
            width={40}
          />
          <Column
            title="2"
            dataIndex="awayTeamScore"
            key="awayTeamScore"
            width={40}
          />
          <Column
            title="П"
            dataIndex="winner"
            key="winner"
            width={80}
            render={renderP}
          />
        </ColumnGroup>
        <Column
          title="Гост"
          dataIndex="awayTeam"
          key="awayTeam"
          width={columnWidth}
          render={(el: any) => (
            <span>{translateTeamsName(el.name) || "Ще се реши"}</span>
          )}
        />
        {users.map((user: UsersType) => {
          return (
            <ColumnGroup key={user.name} title={user.name}>
              <Column
                title="1"
                dataIndex="homeTeamScore"
                key="homeTeamScore"
                width={80}
                render={(el: any, fullMatch: MatchType) =>
                  renderColumnForUser(el, fullMatch, user, "homeTeamScore")
                }
              />
              <Column
                title="2"
                dataIndex="awayTeamScore"
                key="awayTeamScore"
                width={80}
                render={(el: any, fullMatch: MatchType) =>
                  renderColumnForUser(el, fullMatch, user, "awayTeamScore")
                }
              />
              <Column
                title="П"
                dataIndex="winner"
                key="winner"
                width={80}
                render={(_, record: MatchType) => {
                  let selectedMatchWinner =
                    user.bets.find((el) => el.matchId === record.id)?.winner ||
                    "";
                  return renderP(selectedMatchWinner);
                }}
              />
              <ColumnGroup title="Точки">
                <Column
                  title="T"
                  dataIndex=""
                  key=""
                  width={80 / 2}
                  render={(_, record: MatchType) => {
                    return getPoints(user, record).current;
                  }}
                />
                <Column
                  title="O"
                  dataIndex=""
                  key=""
                  width={80 / 2}
                  render={(_, record: MatchType) => {
                    return getPoints(user, record).total;
                  }}
                />
              </ColumnGroup>
            </ColumnGroup>
          );
        })}
      </Table>
    );
  };

  if (matches.length === 0) {
    return null;
  }

  return (
    <>
      <AutoRefresh refresh={refresh} />
      <p>{AutoRefreshInterval}</p>
      <div style={{ width: "10%" }}>
        <Space direction={"horizontal"}>{oneMatchTable(matches)}</Space>
      </div>
    </>
  );
}
