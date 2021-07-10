import { Space, Spin, Table } from "antd";
import Column from "antd/lib/table/Column";
import axios, { AxiosRequestConfig } from "axios";
import { Key, useEffect, useState } from "react";
import { selectedCompetition } from "../App";
import { LoadingOutlined } from "@ant-design/icons";
import { MatchType, UsersType } from "../helpers/OtherHelpers";

interface NewPointType {
  key: Key;
  matchId: number;
  fullMatch: MatchType;
  point: number;
}

interface PointsType {
  user: string;
  points: NewPointType[];
  totalPoints: number;
}

export default function PlayersPoints() {
  const [points, setPoints] = useState<PointsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPointsFromDB();
    // eslint-disable-next-line
  }, []);

  const getPointsFromDB = async () => {
    let users = (await getUsersFromDB()) || [];
    let matches = (await getMatchesFromDB()) || [];

    if (users.length === 0) {
      return;
    }

    if (matches.length === 0) {
      return;
    }
    let points: PointsType[] = [];
    users.forEach((user) => {
      matches.forEach((match) => {
        let newPointModule = points.find((el) => el.user === user.name);

        if (!newPointModule) {
          newPointModule = {
            user: user.name,
            points: [],
            totalPoints: 0,
          };
        }

        let newPoint: NewPointType = {
          key: match.key,
          matchId: match.id,
          fullMatch: match,
          point: getPointForEvent(match, user),
        };

        newPointModule.points.push(newPoint);
        newPointModule.totalPoints =
          newPointModule.totalPoints + newPoint.point;
        newPointModule.points.sort((a, b) => a.matchId - b.matchId);

        if (points.findIndex((el) => el.user === user.name) === -1) {
          points.push(newPointModule);
        }
      });
    });
    setPoints(points);
    setLoading(false);
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

  // eslint-disable-next-line
  const getMatchesFromDB = async () => {
    let response;
    try {
      let config: AxiosRequestConfig = {
        method: "GET",
        url: `https://api.football-data.org/v2/competitions/${selectedCompetition}/matches`,
        headers: {
          "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
        },
      };

      response = await axios(config);

      let data: MatchType[] = response.data.matches;
      data = data.slice(0, 55); // limit First 3
      let matches: MatchType[] = [];

      data.forEach((el, index) => {
        let score = el.score;
        let matchToAdd: MatchType = {
          status: el.status,
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
      return matches;
    } catch (e: any) {
      return undefined;
    }
  };

  // eslint-disable-next-line
  const getUsersFromDB = async () => {
    let res;
    try {
      res = await axios({
        method: "GET",
        withCredentials: true,
        url: "/api",
      });
      let users = [...res.data] as UsersType[];
      let newUsers: UsersType[] = [];
      users.forEach((el) => {
        let userToAdd: UsersType = {
          name: el.name,
          bets: el.bets,
          index: el.index,
          finalWinner: el.finalWinner,
          colorTable: el.colorTable,
          totalPoints: el.totalPoints,
        };
        if (el._id) {
          userToAdd.id = el._id;
        }
        newUsers.push(userToAdd);
      });
      return newUsers;
    } catch (e: any) {
      return undefined;
    }
  };

  const renderAllPointsGroup = () => {
    return (
      <div>
        {points.map((pointsGroup, index) => {
          return (
            <div key={index} style={{ width: 600, marginBottom: 20 }}>
              <Space direction={"horizontal"} size={10}>
                <span
                  style={{ fontSize: "20px" }}
                >{`${pointsGroup.user}`}</span>
                <span
                  style={{ fontSize: "20px" }}
                >{`Общо точки ${pointsGroup.totalPoints}`}</span>
                <span style={{ fontSize: "20px" }}>{`Точки по мачове:`}</span>
              </Space>
              {getTable(pointsGroup.points)}
            </div>
          );
        })}
      </div>
    );
  };

  const getTable = (points: NewPointType[]) => {
    let windowHeight = window.innerHeight;
    return (
      <Table
        loading={loading}
        dataSource={points}
        pagination={false}
        bordered
        scroll={{ y: windowHeight * 0.77 }}
      >
        <Column
          title="Домакин"
          dataIndex="fullMatch"
          render={(el: MatchType) => {
            return el.homeTeam.name;
          }}
        />
        <Column
          title="Резултат"
          dataIndex="fullMatch"
          width={90}
          render={(el: MatchType) => {
            let res = `${el.homeTeamScore} : ${el.awayTeamScore}`;
            return (
              <span
                style={{
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {res}
              </span>
            );
          }}
        />
        <Column
          title="Гост"
          dataIndex="fullMatch"
          render={(el: MatchType) => {
            return el.awayTeam.name;
          }}
        />
        <Column title="ID" dataIndex="point" key="point" width={56} />
      </Table>
    );
  };

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

  if (points?.length === 0) {
    return null;
  }

  return <div>{renderAllPointsGroup()}</div>;
}
