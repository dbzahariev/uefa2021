import axios, { AxiosRequestConfig } from "axios";
import { selectedCompetition } from "../App";
import $ from "jquery";
import {
  coefficientFinal,
  coefficientQuarterFinal,
  coefficientSemiFinal,
} from "../components/Rules";
import { Key } from "react";

export interface ScoreType {
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
}

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
  stage?: string | undefined;
  score?: ScoreType;
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
  totalPoints: number;
  finalWinner: string;
  colorTable: string;
}

export const getAllUsers = (setUsers: Function) => {
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
          totalPoints: 0,
        };
        if (el._id) {
          userToAdd.id = el._id;
        }
        el.bets.forEach((bet) => {
          userToAdd.totalPoints = (userToAdd.totalPoints || 0) + bet.point;
        });

        newUsers.push(userToAdd);
      });

      // newUsers.sort((a, b) => a.index - b.index);

      setUsers(newUsers);
    })
    .catch((err) => console.error(err));
};

export const reloadData = (
  setMatches: Function,
  getAllUsers: Function,
  setUsers: Function,
  users: UsersType[],
  matches: MatchType[]
) => {
  getAllMatches(setMatches);
  getAllUsers();
  let res = getPoints(users, matches);
  res.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
  setUsers(res);
};

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

export const getPoints = (newUsers: UsersType[], matches: MatchType[]) => {
  const getPointForEvent = (selectedMatch: MatchType, user: UsersType) => {
    let bet = user.bets.find((el) => el.matchId === selectedMatch.id);
    let res = 0;

    if (bet) {
      const R1 = selectedMatch.homeTeamScore;
      const R2 = selectedMatch.awayTeamScore;
      const P1 = bet.homeTeamScore;
      const P2 = bet.awayTeamScore;
      const R3 = selectedMatch.winner;
      const P3 = bet.winner;
      if (
        R1 === undefined ||
        R2 === undefined ||
        P1 === undefined ||
        P2 === undefined
      ) {
        return res;
      }

      let difSM: number | undefined = R1 - R2;

      let difBet: number | undefined = P1 - P2;

      if (R1 === P1 && R2 === P2) {
        res = 3;
      } else if (difSM === difBet) {
        res = 2;
      } else if (
        (P1 > P2 && R1 > R2) ||
        (P1 === P2 && R1 === R2) ||
        (P1 < P2 && R1 < R2)
      ) {
        res = 1;
      }

      if (
        (selectedMatch.group || "").indexOf("Group") === -1 &&
        selectedMatch.status === "FINISHED" &&
        R3 === P3
      ) {
        res += 1;
      }

      if (selectedMatch.group === "QUARTER_FINAL") {
        res *= coefficientQuarterFinal;
      } else if (selectedMatch.group === "SEMI_FINAL") {
        res *= coefficientSemiFinal;
      } else if (selectedMatch.group === "FINAL") {
        res *= coefficientFinal;
      }

      let betDate = new Date(bet.date);
      let matchDate = new Date(selectedMatch.utcDate);
      let diffTime = betDate.getTime() - matchDate.getTime();

      if (diffTime > 0) {
        res = res / 2;
      }
    }
    return res;
  };

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
      .then((res) => {})
      .catch((err) => console.error(err));
  }

  return res;
};

export const getAllFinalWinner = (users: UsersType[]) => {
  if (users.length === 0) {
    return;
  }
  let foo: any[] = [];
  users.forEach((user) => {
    foo.push({ name: user.name, finalWinner: user.finalWinner });
  });
};

export const stylingTable = (users: UsersType[]) => {
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
    $(selector2).css("border-color", `hsl(${users[i].colorTable}, 100%, 50%)`);
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
  ).css("top", "28px");

  $(`#root > div:nth-child(3)`).css("display", "inline");
};

export const calcScore = (match: MatchType, score: any) => {
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

  if (res.ht !== undefined) {
    res.ht -= match.score?.extraTime.homeTeam || 0;
  }
  if (res.at !== undefined) {
    res.at -= match.score?.extraTime.awayTeam || 0;
  }

  if (res.ht !== undefined) {
    res.ht -= match.score?.penalties.homeTeam || 0;
  }
  if (res.at !== undefined) {
    res.at -= match.score?.penalties.awayTeam || 0;
  }

  return res;
};

export const getAllMatches = (setMatches: Function) => {
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

      data.forEach((el: MatchType, index) => {
        if (el.id === 325091) {
        }
        let score = el.score;

        let calculatedScore = calcScore(el, score);

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
          score: el.score,
        };
        matches.push(matchToAdd);
      });
      setMatches(matches);
    })
    .catch((error) => console.error(error));
};
