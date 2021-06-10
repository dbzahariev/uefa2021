import { Input, notification, Space, Spin, Table } from "antd";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import axios, { AxiosRequestConfig } from "axios";
import { Key, useEffect, useRef, useState } from "react";
import { selectedCompetition } from "../App";
import { translateTeamsName } from "../helpers/Translate";
import AutoRefresh, { AutoRefreshInterval } from "./AutoRefresh";
import $ from "jquery";
import { LoadingOutlined } from "@ant-design/icons";

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
  group?: string | undefined;
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
  index: number;
  _id?: string;
  id?: string;
  totalPoints?: number;
  finalWinner: "string";
}

export const renderP = (el: string) => {
  let result = "";
  if (el === "HOME_TEAM") {
    result = "Д";
  } else if (el === "AWAY_TEAM") {
    result = "Г";
  } else if (el === "DRAW") {
    result = "Р";
  } else {
    result = "";
  }
  return <span>{result}</span>;
};

export default function AllMatches({ refresh }: { refresh: Function }) {
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [users, setUsers] = useState<UsersType[]>([]);
  const [loading, setLoading] = useState(false);

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
        data = data.slice(0, 55); // limit First 3
        let matches: MatchType[] = [];

        data.forEach((el: any, index) => {
          if (el.id === 325091) {
            // debugger;
          }
          let score = el.score;
          let matchToAdd: MatchType = {
            number: index + 1,
            key: matches.length || 0,
            id: el.id,
            homeTeam: el.homeTeam,
            awayTeam: el.awayTeam,
            utcDate: el.utcDate,
            group: el.group || el.stage,
            winner: score?.winner || "",
            homeTeamScore: score?.fullTime?.homeTeam || "",
            awayTeamScore: score?.fullTime?.awayTeam || "",
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
            index: el.index,
            finalWinner: el.finalWinner,
          };
          if (el._id) {
            userToAdd.id = el._id;
          }
          newUsers.push(userToAdd);
        });

        newUsers.sort((a, b) => a.index - b.index);

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

  useEffect(() => {
    if (users.length > 0 && matches.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [users.length, matches.length]);

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
    let columnWidth = 150;

    const handleChangeFinal = (ev: any, user: any) => {
      let newFinalWinner: string = ev.target.value;
      axios({
        method: "POST",
        data: { finalWinner: newFinalWinner },
        withCredentials: true,
        url: `/api/update?id=${user.id}`,
      })
        .then((res) => {
          notification.open({
            message: `Победителят е записан успешно!`,
            type: "success",
          });
          window.location.reload();
        })
        .catch((err) => {
          notification.open({
            message: `Грешка`,
            type: "error",
          });
        });
    };

    const getFinalWinner = (user: any) => {
      return user.finalWinner;
    };

    return (
      <Table
        dataSource={AllMatches}
        pagination={false}
        bordered
        scroll={{ y: windowHeight * 0.5 }}
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
        footer={() => {
          return (
            <div>
              <Space direction={"horizontal"} size={window.innerWidth * 0.315}>
                <div
                  style={{
                    backgroundColor: "red",
                  }}
                >
                  <span>Последният оцелял:</span>
                </div>
                <Space direction={"horizontal"} size={2}>
                  {users.map((user) => {
                    return (
                      <div
                        style={{
                          width: window.innerWidth * 0.24,
                        }}
                      >
                        <Input
                          placeholder=""
                          defaultValue={getFinalWinner(user)}
                          value={getFinalWinner(user)}
                          onChange={(el) => handleChangeFinal(el, user)}
                        />
                      </div>
                    );
                  })}
                </Space>
              </Space>
            </div>
          );
        }}
      >
        <Column title="Н" dataIndex="number" key="number" width={56} />
        <Column
          title="Домакин"
          dataIndex="homeTeam"
          key="homeTeam"
          width={columnWidth}
          render={(el: any) => {
            return <span>{translateTeamsName(el.name) || "Ще се реши"}</span>;
          }}
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
            width={40}
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
        <Column
          title="Група"
          dataIndex="group"
          width={90}
          render={(el: any) => (
            <span>{translateTeamsName(el) || "Ще се реши"}</span>
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
                width={40}
                render={(_, record: MatchType) => {
                  let selectedMatchWinner =
                    user.bets.find((el) => el.matchId === record.id)?.winner ||
                    "";
                  return renderP(selectedMatchWinner);
                }}
              />
              <ColumnGroup title="Точки">
                <Column
                  title="Точки"
                  dataIndex=""
                  key=""
                  width={160 / 2}
                  render={(_, record: MatchType) => {
                    return getPoints(user, record).current;
                  }}
                />
                <Column
                  title="Общо"
                  dataIndex=""
                  key=""
                  width={160 / 2}
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

  useEffect(() => {
    const getSelector1 = (index: number) => {
      let res = "";
      res += `tr:nth-child(1) > th:nth-child(${index + 6}), `;
      res += `tr:nth-child(2) > th:nth-child(${4 * index}), `;
      res += `tr:nth-child(2) > th:nth-child(${4 * index + 1}), `;
      res += `tr:nth-child(2) > th:nth-child(${4 * index + 2}), `;
      res += `tr:nth-child(2) > th:nth-child(${4 * index + 3}), `;
      res += `tr:nth-child(3) > th:nth-child(${index + (index - 1)}), `;
      res += `tr:nth-child(3) > th:nth-child(${index + index})`;

      return res;
    };

    const getSelector2 = (index: number) => {
      let res = "";

      for (let i = 5 * index - 5; i < 5 * index; i++) {
        res += `td:nth-child(${9 + i}), `;
      }

      res = res.slice(0, res.length - 2);

      return res;
    };

    let colors = ["10", "180", "50", "203", "129"];
    for (let i = 0; i < users.length; i++) {
      let selector1 = getSelector1(i + 1);
      $(selector1).css(
        "background-color",
        `hsl(${colors[users[i].index - 1]}, 100%, 95%)`
      );

      let selector2 = getSelector2(i + 1);

      $(selector2).css("border-bottom", "1px solid");
      $(selector2).css("border-left", "1px solid");
      $(selector2).css("border-right", "1px solid");
      $(selector2).css(
        "border-color",
        `hsl(${colors[users[i].index - 1]}, 100%, 55%)`
      );
    }
  }, [loading, users]);

  if (loading) {
    return (
      <div
        style={{
          height: window.innerHeight * 0.4,
          width: window.innerWidth,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
            size="large"
            style={{ width: "100%", height: "100%", alignItems: "center" }}
          />
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return null;
  }

  return (
    <>
      <AutoRefresh refresh={refresh} />
      <div style={{ width: 2500 }}>
        <Space direction={"horizontal"}>{oneMatchTable(matches)}</Space>
      </div>
    </>
  );
}
