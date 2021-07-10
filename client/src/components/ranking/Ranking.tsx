import { useEffect, useState } from "react";
import {
  MatchType,
  ScoreType,
  stylingTable,
  UsersType,
} from "../../helpers/OtherHelpers";
import { getMatchesForView } from "../AllMatches2";
import OneMatchTable from "../OneMatchTable";
import rankingImg from "./rankingImg.svg";
import backup2020Matches from "./2020Matches.json";
import backup2020Users from "./2020Users.json";
import { Space, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

export default function Ranking() {
  const [users, setUsers] = useState<UsersType[]>([]);
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [showGroups, setShowGroups] = useState(true);

  const [dimensions, setDimensions] = useState({
    widthI: window.innerWidth,
    heightI: window.innerHeight,
    widthO: window.innerWidth,
    heightO: window.innerHeight,
  });

  const getMatches = () => {
    let matchesFromBackup: MatchType[] = [];
    backup2020Matches.forEach((el) => {
      let matchToAdd: MatchType = {
        number: el.number,
        key: el.key,
        id: el.id,
        homeTeam: el.homeTeam,
        awayTeam: el.awayTeam,
        utcDate: new Date(el.utcDate),
        status: el.status,
        score: el.score as ScoreType,
        homeTeamScore: el.homeTeamScore,
        awayTeamScore: el.awayTeamScore,
        group: el.group,
      };
      matchesFromBackup.push(matchToAdd);
    });
    setMatches(matchesFromBackup);
  };

  const getUsers = () => {
    let usersFromBackup: UsersType[] = [];
    backup2020Users.forEach((el) => {
      let userToAdd: UsersType = {
        name: el.name,
        bets: el.bets as any[],
        index: el.index,
        totalPoints: el.totalPoints,
        finalWinner: el.finalWinner,
        colorTable: el.colorTable,
      };
      usersFromBackup.push(userToAdd);
    });
    setUsers(usersFromBackup);
  };

  useEffect(() => {
    getUsers();
    getMatches();

    const updateWindowDimensions = () => {
      setDimensions({
        widthI: window.innerWidth,
        heightI: window.innerHeight,
        widthO: window.outerWidth,
        heightO: window.outerHeight,
      });
    };

    window.addEventListener("resize", updateWindowDimensions);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    stylingTable(users);
  }, [showGroups, users]);

  const getSortedUsers = () => {
    let res = users.sort((a, b) => b.totalPoints - a.totalPoints);

    return res;
  };
  if (users.length === 0) {
    return null;
  }

  const oneHuman = (user: UsersType, color2: string) => {
    return <span style={{ color: color2, fontSize: "21px" }}>{user.name}</span>;
  };

  const ranking = () => {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: `${784 * 0.6}px`,
          height: `${487 * 0.6}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            paddingLeft: "25%",
            paddingTop: "10%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[1], "#1F88C9")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "50%",
            top: 0,
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[0], "#9EB644")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "73%",
            paddingTop: "17%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[2], "#E24786")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "9%",
            paddingTop: "67%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[3], "#FFB800")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "38%",
            paddingTop: "67%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[4], "#FFB800")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "62%",
            paddingTop: "67%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[5], "#FFB800")}
        </div>
        <div
          style={{
            position: "absolute",
            paddingLeft: "87%",
            paddingTop: "67%",
            width: "20%",
            height: "7%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {oneHuman(getSortedUsers()[6], "#FFB800")}
        </div>

        <img
          src={rankingImg}
          alt="Separator"
          style={{
            marginTop: "6%",
            justifyContent: "center",
            display: "flex",
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "1%",
      }}
    >
      {ranking()}

      <div style={{ marginTop: "50px" }}>
        <div>
          <Space direction={"horizontal"} style={{ margin: 5, paddingTop: 10 }}>
            <span>Показване на групова фаза</span>
            <Switch
              onChange={(newValue: any) => setShowGroups(newValue)}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              checked={showGroups}
            />
          </Space>
        </div>
        <OneMatchTable
          AllMatches={getMatchesForView(matches, showGroups)}
          users={users}
        />
      </div>
    </div>
  );
}
