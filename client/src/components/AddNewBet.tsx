import { Input, InputNumber, notification, Select, Space, Table } from "antd";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import axios, { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { selectedCompetition } from "../App";
import { calcScore, UsersType, MatchType } from "../helpers/OtherHelpers";
import { translateTeamsName } from "../helpers/Translate";
import { renderP } from "./AllMatches";

const { Option } = Select;

export default function AddNewBet() {
  const [users, setUsers] = useState<UsersType[]>([]);
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [usersNames, setUsersNames] = useState<string[]>([]);

  useEffect(() => {
    getAllUsersNames();
    getAllMatches();
  }, []);

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

          let calculatedScore = calcScore(el, score);

          let matchToAdd: MatchType = {
            status: el.status,
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
          };
          let ss = el.status;
          if (ss !== "FINISHED") {
            matches.push(matchToAdd);
          }
        });
        setMatches(matches);
      })
      .catch((error) => console.error(error));
  };

  const getAllUsers = (selectedUserName: string) => {
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
          if (userToAdd.name === selectedUserName) {
            newUsers.push(userToAdd);
          }
        });

        // newUsers.sort((a, b) => a.index - b.index);

        setUsers(newUsers);
      })
      .catch((err) => {});
  };

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
      })
      .catch((err) => {});
  };

  const handleChangeForSelector = (value: any) => {
    setSelectedUserName(value);
  };

  useEffect(() => {
    getAllUsers(selectedUserName);
  }, [selectedUserName]);

  const checkDisabledInput = (fullMatch: MatchType, user: UsersType) => {
    const haveGest = (fullMatch: MatchType, user: UsersType) => {
      let myBet = user.bets.find((el) => el.matchId === fullMatch.id);

      let awayTeamScore = -1;
      let homeTeamScore = -1;
      let haveBet = false;
      if (myBet?.awayTeamScore !== undefined)
        awayTeamScore = myBet.awayTeamScore;
      if (myBet?.homeTeamScore !== undefined)
        homeTeamScore = myBet.homeTeamScore;

      if (awayTeamScore !== -1 || homeTeamScore !== -1) {
        haveBet = true;
      }
      return haveBet;
    };

    let result = false;
    let now = new Date();
    let matchDate = new Date(fullMatch.utcDate);
    let difference = now.getTime() - matchDate.getTime();
    let differenceMin = Math.round(difference / 1000 / 60);

    let haveBet = haveGest(fullMatch, user);

    if (differenceMin >= 0 && differenceMin <= 15 && haveBet) {
      result = true;
    }

    if (differenceMin >= 15) {
      result = true;
    }

    if (differenceMin > 0 && differenceMin < 15) {
      result = haveBet;
    }

    if (differenceMin < 0) {
      result = false;
    }

    return result;
  };

  const calcWinner = (
    homeScore: number,
    awayScore: number,
    forW: number = 0
  ) => {
    let res: string = "";
    if (homeScore > awayScore || forW === 1) {
      res = "HOME_TEAM";
    } else if (awayScore > homeScore || forW === 2) {
      res = "AWAY_TEAM";
    } else {
      res = "";
    }
    if (homeScore === -1 || awayScore === -1) {
      res = "";
    }
    return res;
  };

  const setBetsToDB = (userProp: UsersType) => {
    if (userProp) {
      let user = userProp;
      let betsToSave = [...user.bets];
      betsToSave = betsToSave.filter((bet) => bet.homeTeamScore !== -1);
      betsToSave = betsToSave.filter((bet) => bet.awayTeamScore !== -1);

      axios({
        method: "POST",
        data: { bets: betsToSave },
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

  const handleChange = (
    el1: any,
    user: UsersType,
    fullMatch: MatchType,
    type: "homeTeamScore" | "awayTeamScore" | "winner"
  ) => {
    let newValue: string | number = el1;

    let newUsers = [...users];
    let curUser = newUsers.find((userSel) => userSel.name === user.name);

    if (!curUser) return null;

    let bet = curUser.bets.find((el) => el.matchId === fullMatch.id);

    if (newValue === null) {
      newValue = -1;
    }

    if (!bet) {
      let newBet = {
        matchId: fullMatch.id,
        homeTeamScore: -1,
        awayTeamScore: -1,
        winner: "DRAW",
        [type]: Number(newValue),
        point: 0,
        date: new Date(),
      };

      if (type === "winner") {
        let kk = el1.target.value.toString().toLowerCase();
        if (
          kk === "1" ||
          kk === "h" ||
          kk === "home" ||
          kk === "домакин" ||
          kk === "д"
        ) {
          newValue = 1;
        } else if (
          kk === "2" ||
          kk === "a" ||
          kk === "away" ||
          kk === "гост" ||
          kk === "г"
        ) {
          newValue = 2;
        } else {
          console.log("Грешка при въвеждане!!!", kk);
        }

        newBet.winner = calcWinner(
          newBet.homeTeamScore,
          newBet.awayTeamScore,
          Number(newValue)
        );
      } else {
        newBet.winner = calcWinner(newBet.homeTeamScore, newBet.awayTeamScore);
      }
      bet = newBet;

      curUser.bets.push(newBet);
    } else {
      if (type === "awayTeamScore" || type === "homeTeamScore") {
        bet[type] = Number(newValue);
      }

      if (type === "winner") {
        let kk = el1.target.value.toString().toLowerCase();
        if (
          kk === "1" ||
          kk === "h" ||
          kk === "home" ||
          kk === "домакин" ||
          kk === "д"
        ) {
          newValue = 1;
        } else if (
          kk === "2" ||
          kk === "a" ||
          kk === "away" ||
          kk === "гост" ||
          kk === "г"
        ) {
          newValue = 2;
        } else {
          console.log("Грешка при въвеждане!!!", kk);
        }

        bet.winner = calcWinner(
          bet.homeTeamScore,
          bet.awayTeamScore,
          Number(newValue)
        );
      } else {
        bet.winner = calcWinner(bet.homeTeamScore, bet.awayTeamScore);
      }
    }

    bet.date = new Date();

    setUsers(newUsers);

    setBetsToDB(user);
  };

  const getValue = (
    user: UsersType,
    type: "homeTeamScore" | "awayTeamScore",
    fullMatch: MatchType,
    isWinner: boolean
  ) => {
    let selectedMatch = user.bets.find((el) => el.matchId === fullMatch.id);

    let res: string | number = "";
    if (selectedMatch) {
      let foo = selectedMatch[type];
      if (foo !== -1) {
        res = foo;
      }
    }
    if (isWinner && selectedMatch !== undefined) {
      let foo = selectedMatch.winner;
      res = foo;
    }

    // if (res === "DRAW") {
    //   res = "";
    // }
    return res;
  };

  const oneMatchTable = (AllMatches: MatchType[]) => {
    let columnWidth = 150;

    const renderColumnForUser = (
      el: any,
      fullMatch: MatchType,
      user: UsersType,
      type: "homeTeamScore" | "awayTeamScore"
    ) => {
      return (
        <InputNumber
          min={-1}
          max={10}
          disabled={checkDisabledInput(fullMatch, user)}
          placeholder=""
          defaultValue={""}
          value={getValue(user, type, fullMatch, false)}
          onChange={(el) => handleChange(el, user, fullMatch, type)}
        />
      );
    };

    const renderWinner = (user: UsersType, record: MatchType) => {
      let selectedMatchWinner =
        user.bets.find((el) => el.matchId === record.id)?.winner || "";

      const checkDisablePredWinner = (vall: any) => {
        let res = false;
        let bet = user.bets.find((el) => el.matchId === vall.id);
        if (bet !== undefined) {
          if (bet.homeTeamScore === bet.awayTeamScore) {
            res = false;
          } else {
            res = true;
          }
        }

        return res;
      };

      let res = renderP(selectedMatchWinner);
      // if (selectedMatchWinner === "DRAW") {
      // res = <span>1</span>;
      let vall: string = getValue(
        user,
        "awayTeamScore",
        record,
        true
      ).toString();
      vall = renderP(vall, true).toString();

      res = (
        <Input
          disabled={checkDisablePredWinner(record)}
          style={{ width: 100 }}
          placeholder=""
          value={vall}
          onChange={(el) => handleChange(el, user, record, "winner")}
        />
      );
      // }
      return res;
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
                <span>
                  {`Този мач ще се проведе на ${date}.`}
                  <br />
                  {`Този мач се играе в `}
                </span>

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
                title="Д"
                dataIndex="homeTeamScore"
                key="homeTeamScore"
                width={80}
                render={(el: any, fullMatch: MatchType) =>
                  renderColumnForUser(el, fullMatch, user, "homeTeamScore")
                }
              />
              <Column
                title="Г"
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
                  return renderWinner(user, record);
                }}
              />
            </ColumnGroup>
          );
        })}
      </Table>
    );
  };

  return (
    <div>
      <Select
        defaultValue={"Избери играч"}
        style={{ width: 140 }}
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
      <div style={{ width: 4000 }}>
        <Space direction={"horizontal"}>{oneMatchTable(matches)}</Space>
      </div>
    </div>
  );
}
