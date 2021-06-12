import { Space, Spin, Table } from "antd";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import axios, { AxiosRequestConfig } from "axios";
import { Key, useEffect, useRef, useState } from "react";
import { selectedCompetition } from "../App";
import { translateTeamsName } from "../helpers/Translate";
import AutoRefresh, { AutoRefreshInterval } from "./AutoRefresh";
import $ from "jquery";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

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
  homeTeamScore?: number | undefined;
  awayTeamScore?: number | undefined;
  status: string;
}

export interface UsersType {
  name: string;
  bets: {
    matchId: number;
    homeTeamScore: number;
    awayTeamScore: number;
    winner: string;
    point: number;
    date: Date;
  }[];
  index: number;
  _id?: string;
  id?: string;
  totalPoints?: number;
  finalWinner: "string";
  colorTable: string;
}

export const renderP = (
  el: string,
  user: UsersType | null,
  fullMatch: MatchType | null
) => {
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
  if (!user) {
    if (
      fullMatch &&
      (fullMatch.status === "IN_PLAY" || fullMatch.status === "PAUSED")
    ) {
      result = "?";
    }
    return <span>{result}</span>;
  } else {
    if (fullMatch) {
      let matchDate = new Date(fullMatch.utcDate);
      let now = new Date();
      let dif = matchDate.getTime() - now.getTime();
      if (result === "" && dif > 0 && fullMatch.winner === "") {
        result = "";
      } else if (dif > 0) {
        result = "?";
      }
    }
    return <span>{result}</span>;
  }
};

export default function AllMatches2({ refresh }: { refresh: Function }) {
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [users, setUsers] = useState<UsersType[]>([]);
  const [loading, setLoading] = useState(false);

  let intervalRef = useRef<any>();

  useEffect(() => {
    if (AutoRefreshInterval >= 1 && AutoRefreshInterval !== "disable") {
      intervalRef.current = setInterval(() => {
        reloadData();
        // getAllMatches();
        // getAllUsers();
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

  useEffect(() => {
    getAllFinalWinner();
    // eslint-disable-next-line
  }, [users]);

  useEffect(() => {
    if (users.length > 0 && matches.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [users.length, matches.length]);

  useEffect(() => {
    const getSelector1 = (index: number) => {
      let res = "";
      res += `tr:nth-child(1) > th:nth-child(${index + 5}), `;
      res += `tr:nth-child(2) > th:nth-child(${4 * index}), `;
      res += `tr:nth-child(2) > th:nth-child(${4 * index + 1}), `;
      res += `tr:nth-child(2) > th:nth-child(${4 * index + 2}), `;
      res += `tr:nth-child(2) > th:nth-child(${4 * index + 3}), `;
      res += `tr:nth-child(3) > th:nth-child(${index + (index - 1)}), `;
      res += `tr:nth-child(3) > th:nth-child(${index + index})`;

      return res;
    };

    const getSelector2 = (index: number) => {
      let result = "";

      for (let i = 4 * index - 4; i < 4 * index; i++) {
        result += `td:nth-child(${8 + i}), `;
      }

      result = result.slice(0, result.length - 2);

      return result;
    };

    // let colors = ["10", "180", "50", "80", "203", "284", "129"];
    for (let i = 0; i < users.length; i++) {
      let selector1 = getSelector1(i + 1);
      $(selector1).css(
        "background-color",
        `hsl(${users[i].colorTable}, 100%, 95%)`
      );

      let selector2 = getSelector2(i + 1);

      $(selector2).css("border-bottom", "1px solid");
      $(selector2).css("border-left", "1px solid");
      $(selector2).css("border-right", "1px solid");
      $(selector2).css(
        "border-color",
        `hsl(${users[i].colorTable}, 100%, 55%)`
      );
    }
  }, [loading, users]);

  const reloadData = () => {
    getAllMatches();
    getAllUsers();
  };

  const getAllFinalWinner = () => {
    if (users.length === 0) {
      return;
    }
    let foo: any[] = [];
    users.forEach((user) => {
      foo.push({ name: user.name, finalWinner: user.finalWinner });
    });
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
            colorTable: el.colorTable,
          };
          if (el._id) {
            userToAdd.id = el._id;
          }
          newUsers.push(userToAdd);
        });

        // newUsers.sort((a, b) => a.index - b.index);

        setUsers(newUsers);
      })
      .catch((err) => {});
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
      let difSM: number | undefined = undefined;
      let difBet: number | undefined = undefined;
      if (selectedMatch.homeTeamScore && selectedMatch.awayTeamScore) {
        difSM = selectedMatch.homeTeamScore - selectedMatch.awayTeamScore;
      }
      if (bet.homeTeamScore && bet.awayTeamScore) {
        difBet = bet.homeTeamScore - bet.awayTeamScore;
      }
      if (difSM && difBet && difSM === difBet) {
        res = 2;
      }
    }
    return res;
  };

  const getPoints = (user: UsersType, match: MatchType) => {
    let res: {
      current: number | string;
      total: number | string;
    } = { current: 5, total: 7 };
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

    if (match.winner === "") {
      if (dd) {
        res.current = "?";
      } else {
        res.current = "";
      }
    }

    if (match.status === "IN_PLAY" || match.status === "PAUSED") {
      res.current = "?";
    }

    return res;
  };

  const oneMatchTable = (AllMatches: MatchType[]) => {
    // eslint-disable-next-line
    let windowHeight = window.innerHeight;
    let columnWidth = 150;

    const renderColumnForUser = (
      el: any,
      fullMatch: MatchType,
      user: UsersType,
      type: "homeTeamScore" | "awayTeamScore"
    ) => {
      const getValue = (
        user: UsersType,
        type: "homeTeamScore" | "awayTeamScore",
        fullMatch: MatchType
      ) => {
        let selectedMatch = user.bets.find((el) => el.matchId === fullMatch.id);
        if (selectedMatch) return selectedMatch[type];
        else return "";
      };

      let dd = getValue(user, type, fullMatch);
      let matchDate = new Date(fullMatch.utcDate);
      let now = new Date();
      let dif = matchDate.getTime() - now.getTime();
      if (dif > 0 && dd.toString().length > 0) {
        dd = "?";
      }
      return dd;
    };

    return (
      <Table
        dataSource={AllMatches}
        pagination={false}
        bordered
        // scroll={{ y: windowHeight * 0.2 }}
        expandable={{
          expandedRowRender: (record: MatchType) => {
            let date = new Date(record.utcDate).toLocaleString("bg-bg");
            return (
              <>
                <span>{`Този мач ще се проведе на ${date}. Този мач се играе в `}</span>
                <Link to={`/groups/${record.group}`}>
                  {translateTeamsName(record.group || "") || "Ще се реши"}
                </Link>
              </>
            );
          },
          rowExpandable: () => true,
          defaultExpandedRowKeys: ["1"],
        }}
      >
        <Column
          title="Н"
          dataIndex="number"
          key="number"
          width={56}
          fixed={true}
        />
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
            render={(el: any, record: MatchType) =>
              record.status === "IN_PLAY" || record.status === "PAUSED"
                ? "?"
                : el
            }
          />
          <Column
            title="2"
            dataIndex="awayTeamScore"
            key="awayTeamScore"
            width={40}
            render={(el: any, record: MatchType) =>
              record.status === "IN_PLAY" || record.status === "PAUSED"
                ? "?"
                : el
            }
          />
          <Column
            title="П"
            dataIndex="winner"
            key="winner"
            width={40}
            render={(el, match: MatchType) => renderP(el, null, match)}
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
        {/* <Column
          title="Група"
          dataIndex="group"
          key="group"
          width={90}
          render={(el: any) => {
            return (
              <Link to={`/groups/${el}`}>
                {translateTeamsName(el) || "Ще се реши"}
              </Link>
            );
          }}
        /> */}
        {users.map((user: UsersType) => {
          let totalPoints: string | number = "?";
          let haveInPlay = false;
          matches.forEach((match) => {
            if (
              !haveInPlay &&
              (match.status === "IN_PLAY" || match.status === "PAUSED")
            ) {
              haveInPlay = true;
            }

            if (!haveInPlay) {
              totalPoints = getPoints(user, match).total;
            }
          });
          if (haveInPlay) {
            totalPoints = "?";
          }

          return (
            <ColumnGroup
              key={user.name}
              title={`${user.name} (${totalPoints})`}
            >
              <Column
                title="1"
                dataIndex="homeTeamScore"
                key="homeTeamScore"
                width={40}
                render={(el: any, fullMatch: MatchType) =>
                  renderColumnForUser(el, fullMatch, user, "homeTeamScore")
                }
              />
              <Column
                title="2"
                dataIndex="awayTeamScore"
                key="awayTeamScore"
                width={40}
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
                  return renderP(selectedMatchWinner, user, record);
                }}
              />
              <Column
                title="Т"
                dataIndex=""
                key="points"
                width={40}
                render={(_, record: MatchType) => {
                  return getPoints(user, record).current;
                }}
              />
              {/* <Column
                  title="Общо"
                  dataIndex=""
                  key="totalPoints"
                  width={160 / 2}
                  render={(_, record: MatchType) => {
                    return getPoints(user, record).total;
                  }}
                /> */}
              {/* </ColumnGroup> */}
            </ColumnGroup>
          );
        })}
      </Table>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          // height: window.innerHeight * 0.4,
          // width: window.innerWidth,
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
      {/* <div style={{ width: 4000 }}>  */}
      <div>
        <Space direction={"horizontal"}>{oneMatchTable(matches)}</Space>
      </div>
    </>
  );
}
