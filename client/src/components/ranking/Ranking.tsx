import { useEffect, useState } from "react";
import {
  MatchType,
  ScoreType,
  stylingTable,
  UsersType,
} from "../../helpers/OtherHelpers";
import { getMatchesForView } from "../AllMatches2";
import OneMatchTable from "../OneMatchTable";
import rankingImg4 from "./rankingImg_4_ranks.svg";
import rankingImg5 from "./rankingImg_5_ranks.svg";
import rankingImg6 from "./rankingImg_6_ranks.svg";
import rankingImg7 from "./rankingImg_7_ranks.svg";
import rankingImg8 from "./rankingImg_8_ranks.svg";
import rankingImg9 from "./rankingImg_9_ranks.svg";
import rankingImg10 from "./rankingImg_10_ranks.svg";
import backup2020 from "./Backup2020.json";
import backup2018 from "./Backup2018.json";
import backup2016 from "./Backup2016.json";
import { Select, Space, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

const { Option } = Select;

const years = [
  { value: "2020", name: { eng: "Euro 2020", bg: "Евро 2020" } },
  { value: "2018", name: { eng: "World 2018", bg: "Световно 2018" } },
  { value: "2016", name: { eng: "Euro 2016", bg: "Евро 2016" } },
];

export default function Ranking() {
  const [users, setUsers] = useState<UsersType[]>([]);
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [showGroups, setShowGroups] = useState(true);
  const [competitionValue, setCompetitionValue] = useState<string>("2016");

  const getMatches = () => {
    let matchesFromBackup: MatchType[] = [];

    let selectedBackup = backup2020;

    if (competitionValue === years[0].value) {
      selectedBackup = backup2020;
    }
    if (competitionValue === years[1].value) {
      selectedBackup = backup2018;
    }
    if (competitionValue === years[2].value) {
      selectedBackup = backup2016;
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

      matchesFromBackup.push(matchToAdd);
    });
    setMatches(matchesFromBackup);
  };

  const getUsers = () => {
    let usersFromBackup: UsersType[] = [];

    let selectedBackup = backup2020;

    if (competitionValue === years[0].value) {
      selectedBackup = backup2020;
    }
    if (competitionValue === years[1].value) {
      selectedBackup = backup2018;
    }

    if (competitionValue === years[2].value) {
      selectedBackup = backup2016;
    }

    selectedBackup.users.forEach((el) => {
      let userToAdd: UsersType = {
        name: el.name,
        bets: el.bets as any[],
        index: el.index,
        finalWinner: el.finalWinner,
        colorTable: el.colorTable,
        totalPoints: el.totalPoints,
      };
      usersFromBackup.push(userToAdd);
    });
    setUsers(usersFromBackup);
  };

  useEffect(() => {
    getUsers();
    getMatches();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (users.length !== 0 && matches.length !== 0) {
      checkValidUser();
    }
    // eslint-disable-next-line
  }, [users, matches]);

  const getPaddingLeft = () => {
    let res = "38%";
    if (users.length === 4) {
      res = "38%";
    }
    if (users.length === 5) {
      res = "75%";
    }
    return res;
  };

  const checkValidUser = () => {
    let countMatches = matches.length;

    //check Matches number
    matches.forEach((el) => {
      let number = Number(el.number);
      let key = Number(el.key);
      let id = Number(el.id);
      let newId = Number(`2018${number < 10 ? 0 : ""}${number}`);

      if (number !== key + 1 || newId !== id) {
        // debugger;
      }
    });

    const calcPoint = (
      bet: {
        matchId: number;
        homeTeamScore: number;
        awayTeamScore: number;
        winner: string;
        point: number;
        date: Date;
      },
      match: MatchType
    ) => {
      let res = 0;
      let matchWinner = match.score?.winner;

      let mh = match?.homeTeamScore;
      let ma = match?.awayTeamScore;
      let bh = bet?.homeTeamScore;
      let ba = bet?.awayTeamScore;
      if (mh === undefined) mh = -1;
      if (ma === undefined) ma = -1;

      if (bet.winner === matchWinner && bh === mh && ba === ma) {
        res = 3;
      }

      if (
        res === 0 &&
        ((mh > ma && bh > ba) ||
          (mh < ma && bh < ba) ||
          (mh === ma && bh === ba))
      ) {
        res = 1;
      }
      if (match.group?.indexOf("Group") === -1) {
        if (bet.winner === matchWinner) {
          res += 1;
        }
      }

      if (bet.matchId === 201845) {
        // debugger;
      }

      if (match.group === "QUARTER_FINAL") {
        res *= 1.25;
      } else if (
        match.group === "SEMI_FINAL" ||
        match.group === "THIRD_POSITION" ||
        match.group === "FINAL"
      ) {
        res *= 1.5;
      }

      return res;
    };

    users.forEach((user) => {
      //check count bets for user
      if (user.bets.length !== countMatches) {
        debugger;
      }
      let userPoints = 0;
      user.bets.forEach((bet) => {
        // check have bet for match
        if (matches.findIndex((el) => el.id === bet.matchId) === -1) {
          debugger;
        }

        // check winner for bet
        if (
          (bet.homeTeamScore || -1) > (bet.awayTeamScore || -1) &&
          bet.winner !== "HOME_TEAM"
        ) {
          debugger;
        }
        if (
          (bet.homeTeamScore || -1) < (bet.awayTeamScore || -1) &&
          bet.winner !== "AWAY_TEAM"
        ) {
          debugger;
        }

        if (user.index === 5) {
          matches.forEach((el) => {
            // check winner for match
            if (
              (el.homeTeamScore || -1) > (el.awayTeamScore || -1) &&
              el.score?.winner !== "HOME_TEAM"
            ) {
              debugger;
            }
            if (
              (el.homeTeamScore || -1) < (el.awayTeamScore || -1) &&
              el.score?.winner !== "AWAY_TEAM"
            ) {
              debugger;
            }

            if (bet.matchId === el.id) {
              let calculatedPoints = calcPoint(bet, el);

              if (bet.point !== calculatedPoints) {
                debugger;
              }
              userPoints += calculatedPoints;
              if (calculatedPoints !== 0) {
              }
            }
          });
        }
      });
      console.log(userPoints, user.totalPoints);
    });
  };

  const getRankingImg = () => {
    console.log(users.length);
    if (users.length === 4) {
      return rankingImg4;
    }
    if (users.length === 5) {
      return rankingImg5;
    }
    if (users.length === 6) {
      return rankingImg6;
    }
    if (users.length === 7) {
      return rankingImg7;
    }
    if (users.length === 8) {
      return rankingImg8;
    }
    if (users.length === 9) {
      return rankingImg9;
    }
    if (users.length === 10) {
      return rankingImg10;
    }
  };

  useEffect(() => {
    stylingTable(users);
  }, [showGroups, users]);

  const getSortedUsers = () => {
    let res = users
      .sort((a, b) => b.index - a.index)
      .sort((a, b) => b.totalPoints - a.totalPoints);
    // debugger;

    return res;
  };
  if (users.length === 0) {
    return null;
  }

  const oneHuman = (user: UsersType, color2: string) => {
    if (user === undefined) {
      return null;
    }
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
            paddingLeft: getPaddingLeft(),
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
          src={getRankingImg()}
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
