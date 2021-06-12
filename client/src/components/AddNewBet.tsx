import { Input, notification, Select, Space, Table } from "antd";
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import axios, { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { selectedCompetition } from "../App";
import { translateTeamsName } from "../helpers/Translate";
import { MatchType, renderP, UsersType } from "./AllMatches";

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

          const calcScore = (match: any) => {
            let res: {
              ht: number | undefined;
              at: number | undefined;
            } = { ht: undefined, at: undefined };

            if (match.id === 285418) {
              // debugger;
            }

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
          };
          let ss = el.status;
          if (ss !== "FINISHED") {
            matches.push(matchToAdd);
          }
        });
        setMatches(matches);
      })
      .catch(function (error) {
        console.log(error);
      });
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

  const handleChangeForSelector = (value: any) => {
    setSelectedUserName(value);
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    getAllUsers(selectedUserName);
  }, [selectedUserName]);

  const checkDisabledInput = (fullMatch: MatchType, user: UsersType) => {
    let result = false;
    let now = new Date();
    let matchDate = new Date(fullMatch.utcDate);
    let difference = now.getTime() - matchDate.getTime();
    let differenceMin = Math.round(difference / 1000 / 60);

    result = differenceMin >= 15;

    let dd = user.bets.find((el) => el.matchId === fullMatch.id);
    if (differenceMin < 15 && !dd) {
      result = false;
    }

    return result;
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
        date: new Date(),
      };
      newBet.winner = calcWinner(newBet.homeTeamScore, newBet.awayTeamScore);
      bet = newBet;

      curUser.bets.push(newBet);
    } else {
      bet[type] = Number(newValue);
      bet.winner = calcWinner(bet.homeTeamScore, bet.awayTeamScore);
    }
    bet.date = new Date();

    setUsers(newUsers);

    setBetsToDB(user);
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
      return (
        <Input
          disabled={checkDisabledInput(fullMatch, user)}
          placeholder=""
          defaultValue={el}
          value={getValue(user, type, fullMatch)}
          onChange={(el) => handleChange(el, user, fullMatch, type)}
        />
      );
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
        {/* <ColumnGroup title="Резултат">
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
        </ColumnGroup> */}
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
              <a href={`/groups/${el}`}>
                {translateTeamsName(el) || "Ще се реши"}
              </a>
            );
          }}
        /> */}
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
        {/* <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="disabled" disabled>
          Disabled
        </Option>
        <Option value="Yiminghe">yiminghe</Option> */}
      </Select>
      <div style={{ width: 4000 }}>
        <Space direction={"horizontal"}>{oneMatchTable(matches)}</Space>
      </div>
    </div>
  );
}
