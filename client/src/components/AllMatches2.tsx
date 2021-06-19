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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getAllFinalWinner();
    // eslint-disable-next-line
  }, [users]);

  useEffect(() => {
    if (users.length > 0 && matches.length > 0) {
      setLoading(false);
      let res = getPoints2(users);
      res.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      setUsers(res);
    } else {
      setLoading(true);
    }
    // eslint-disable-next-line
  }, [users.length, matches.length]);

  const getPoints2 = (newUsers: UsersType[]) => {
    let res = newUsers.slice();

    for (let i = 0; i < res.length; i++) {
      let oneUser = res[i];
      for (let j = 0; j < oneUser.bets.length; j++) {
        let oneBet = oneUser.bets[j];
        let selectedMatch = matches.find((el) => el.id === oneBet.matchId);
        if (selectedMatch && selectedMatch.status === "FINISHED") {
          let kk = getPointForEvent(selectedMatch, oneUser);
          oneUser.totalPoints = (oneUser.totalPoints || 0) + kk;
          oneBet.point = kk;
        } else {
          oneBet.point = 0;
        }
      }
      const getMatchDate = (bet: any) => {
        let res = 0;
        let selectedMatch = matches.find((el) => el.id === bet.matchId);
        if (selectedMatch) res = new Date(selectedMatch?.utcDate).getTime();
        return res;
      };
      oneUser.bets.sort((a, b) => getMatchDate(a) - getMatchDate(b));
      axios({
        method: "POST",
        data: { bets: oneUser.bets },
        withCredentials: true,
        url: `/api/update?id=${oneUser.id}`,
      })
        .then((res) => {
          console.log("ok");
        })
        .catch((err) => {});
    }

    return res;
  };

  const stylingTable = () => {
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
        `hsl(${users[i].colorTable}, 100%, 92%)`
      );

      let selector2 = getSelector2(i + 1);

      $(selector2).css("border-bottom", "1px solid");
      $(selector2).css("border-left", "1px solid");
      $(selector2).css("border-right", "1px solid");
      $(selector2).css(
        "border-color",
        `hsl(${users[i].colorTable}, 100%, 50%)`
      );
    }

    const getForBorders = () => {
      let res = { sel3: "", sel4: "", sel5: "", sel6: "", sel7: "" };

      for (let i = 8; i < 36; i += 4) {
        res.sel3 += `td:nth-child(${i}), `;
      }

      for (let i = 8; i < 36; i += 1) {
        res.sel4 += `tr:nth-child(1) > td:nth-child(${i}), `;
        res.sel5 += `tr:nth-child(51) > td:nth-child(${i}), `;
      }

      for (let i = 6; i < 13; i += 1) {
        res.sel6 += `thead > tr:nth-child(1) > th:nth-child(${i}), `;
      }

      for (let i = 4; i < 50; i += 4) {
        res.sel7 += `thead > tr:nth-child(2) > th:nth-child(${i}), `;
      }

      res.sel3 = res.sel3.slice(0, res.sel3.length - 2);
      res.sel4 = res.sel4.slice(0, res.sel4.length - 2);
      res.sel5 = res.sel5.slice(0, res.sel5.length - 2);
      res.sel6 = res.sel6.slice(0, res.sel6.length - 2);
      res.sel7 = res.sel7.slice(0, res.sel7.length - 2);
      return res;
    };
    let borderSize = "2px solid hsl(0, 0%, 0%)";

    $(getForBorders().sel3).css("border-left", borderSize);
    $(`td:nth-child(35)`).css("border-right", borderSize);
    $(getForBorders().sel4).css("border-top", borderSize);
    $(getForBorders().sel5).css("border-bottom", borderSize);
    $(getForBorders().sel6).css("border-top", borderSize);
    $(getForBorders().sel6).css("border-left", borderSize);
    $(getForBorders().sel7).css("border-left", borderSize);
    $(`thead > tr:nth-child(1) > th:nth-child(12)`).css(
      "border-right",
      borderSize
    );
    $(`thead > tr:nth-child(2) > th:nth-child(31)`).css(
      "border-right",
      borderSize
    );

    $(
      `#root > div:nth-child(3) > div > div > div > div > div > div > div > div > table > thead`
    ).css("position", "sticky");

    $(
      `#root > div:nth-child(3) > div > div > div > div > div > div > div > div > table > thead`
    ).css("position", "-webkit-sticky");

    $(
      `#root > div:nth-child(3) > div > div > div > div > div > div > div > div > table > thead`
    ).css("z-index", "1");

    $(
      `#root > div:nth-child(3) > div > div > div > div > div > div > div > div > table > thead`
    ).css("top", "0");

    $(`#root > div:nth-child(3)`).css("display", "inline");
  };

  useEffect(() => {
    stylingTable();
    // eslint-disable-next-line
  }, [loading, users]);

  const reloadData = () => {
    getAllMatches();
    getAllUsers();
    let res = getPoints2(users);
    res.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    setUsers(res);
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

      if (
        selectedMatch.homeTeamScore !== undefined &&
        selectedMatch.awayTeamScore !== undefined
      ) {
        difSM = selectedMatch.homeTeamScore - selectedMatch.awayTeamScore;
      }
      if (bet.homeTeamScore !== undefined && bet.awayTeamScore !== undefined) {
        difBet = bet.homeTeamScore - bet.awayTeamScore;
      }
      if (res < 3 && difSM && difBet && difSM === difBet) {
        res = 2;
      }

      let betDate = new Date(bet.date);
      let matchDate = new Date(selectedMatch.utcDate);
      let diff = betDate.getTime() - matchDate.getTime();

      if (diff > 0 && res > 0) {
        res = res / 2;
      }
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
            title="Д"
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
            title="Г"
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
        {users.map((user: UsersType) => {
          return (
            <ColumnGroup
              key={user.name}
              title={`${user.name} (${user.totalPoints || 0})`}
            >
              <Column
                title="Д"
                dataIndex="homeTeamScore"
                key="homeTeamScore"
                width={40}
                render={(el: any, fullMatch: MatchType) =>
                  renderColumnForUser(el, fullMatch, user, "homeTeamScore")
                }
              />
              <Column
                title="Г"
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
                  const getCurrentPoints = () => {
                    let res = "";
                    let selectedMatchBet = user.bets.find(
                      (el) => el.matchId === record.id
                    );
                    if (record.status === "FINISHED") {
                      res = (selectedMatchBet?.point || 0).toString();
                    } else if (
                      record.status === "IN_PLAY" ||
                      record.status === "PAUSED"
                    ) {
                      res = "?";
                    } else {
                      let fff = user.bets.find(
                        (el) => el.matchId === record.id
                      );
                      if (fff !== undefined) {
                        res = "?";
                      }
                    }

                    return res;
                  };

                  return getCurrentPoints();
                }}
              />
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
