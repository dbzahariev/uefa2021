import { useEffect, useState } from "react";
import {
  getFinalStats,
  MatchType,
  ScoreType,
  stylingTable,
  UsersType,
  getAllUsers,
  getPoints,
} from "../../helpers/OtherHelpers";
import { getMatchesForView } from "../AllMatches2";
import OneMatchTable from "../OneMatchTable";
import rankingImg from "./rankingImg.svg";
import backup2020 from "./Backup2020.json";
import { Select, Space, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

const { Option } = Select;

const years = [{ value: "2020", name: { eng: "Euro 2020", bg: "Евро 2020" } }];

export default function Ranking() {
  const [users, setUsers] = useState<UsersType[]>([]);
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [showGroups, setShowGroups] = useState(true);
  const [competitionValue, setCompetitionValue] = useState<string>("2020");
  const [finalStat, setFinalStat] = useState<MatchType | undefined>(undefined);

  const getMatches = () => {
    let matchesFromBackup: MatchType[] = [];

    let selectedBackup = backup2020;

    if (competitionValue === years[0].value) {
      selectedBackup = backup2020;
    }

    selectedBackup.matches.forEach((el) => {
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
      if (matchToAdd.group === "FINAL" && finalStat !== undefined) {
        matchToAdd = finalStat;
      }

      matchesFromBackup.push(matchToAdd);
    });
    setMatches(matchesFromBackup);
  };

  useEffect(() => {
    if (
      matches !== undefined &&
      users !== undefined &&
      matches.length > 0 &&
      users.length > 0 &&
      users[0].totalPoints === 0
    ) {
      let res = getPoints(users, matches);
      // res.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      setUsers(res);
      // let res = getPoints(users, matches);
      // res.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      // setUsers(res);
    }
  }, [users, matches]);

  const getUsers = () => {
    // getAllUsers(setUsers);
    let usersFromBackup: UsersType[] = [];
    const getAllPoints = (bets: any[]) => {
      let res = 0;
      bets.forEach((bet) => {
        res += bet.point;
      });
      return res;
    };
    backup2020.users.forEach((el) => {
      let userToAdd: UsersType = {
        name: el.name,
        bets: el.bets as any[],
        index: el.index,
        finalWinner: el.finalWinner,
        colorTable: el.colorTable,
        totalPoints: getAllPoints(el.bets),
      };
      usersFromBackup.push(userToAdd);
    });
    setUsers(usersFromBackup);
  };

  useEffect(() => {
    getFinalStats((el: MatchType) => {
      setFinalStat(el);
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (finalStat !== undefined) {
      // getUsers();

      getAllUsers(setUsers);
      getMatches();
    }
  }, [finalStat]);

  useEffect(() => {
    stylingTable(users);
  }, [showGroups, users]);

  const getSortedUsers = () => {
    let res = users
      .sort((a, b) => b.index - a.index)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return res;
  };
  if (users.length === 0) {
    return null;
  }

  const oneHuman = (user: UsersType, color2: string) => {
    return (
      <p
        style={{ color: color2, fontSize: "15px", whiteSpace: "nowrap" }}
      >{`${user.name} (${user.totalPoints})`}</p>
    );
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
            paddingTop: "68%",
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
            paddingTop: "68%",
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
            paddingTop: "68%",
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
            paddingTop: "68%",
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

  const handleChangeForSelector = (value: any) => {
    setCompetitionValue(value);
  };

  return (
    <div
      style={{
        padding: "1%",
      }}
    >
      <Select
        style={{
          marginLeft: 20,
          width: "240px",
          marginTop: 10,
          marginBottom: 10,
        }}
        // defaultValue={years[0].value}
        value={competitionValue}
        onChange={handleChangeForSelector}
      >
        <Option value="">Избери година</Option>
        {years.map((year) => {
          return (
            <Option key={year.value} value={year.value}>
              {year.name.bg}
            </Option>
          );
        })}
      </Select>
      {ranking()}
      <div style={{ marginTop: "50px" }}>
        <Space
          direction={"horizontal"}
          style={{
            margin: 5,
            paddingTop: 10,
            width: `${window.innerWidth * 0.4}px`,
          }}
        >
          <span style={{ width: `${window.innerWidth * 0.4}px` }}>
            Показване на групова фаза
          </span>
          <Switch
            onChange={(newValue: any) => setShowGroups(newValue)}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={showGroups}
          />
        </Space>
        <OneMatchTable
          AllMatches={getMatchesForView(matches, showGroups)}
          users={users}
        />
      </div>
    </div>
  );
}
