import { Space } from "antd";
import axios, { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";

interface ScoreType {
  duration: string;
  extraTime: {
    homeTeam: number;
    awayTeam: number;
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
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
}

const getFinalScore = async (matchId: string) => {
  var config: AxiosRequestConfig = {
    method: "GET",
    url: `https://api.football-data.org/v2/matches/${matchId}`,
    headers: {
      "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
    },
  };

  let score = (await axios(config)).data.match.score;
  let res = {
    homeTeam: convertResult(score).homeTeam,
    awayTeam: convertResult(score).awayTeam,
  };

  return res;
};

const convertResult = (score: {
  halfTime: { homeTeam: any; awayTeam: any };
  fullTime: { homeTeam: any; awayTeam: any };
  extraTime: { homeTeam: any; awayTeam: any };
}) => {
  let res: {
    result1: string;
    result2: string;
    resultE: string;
    resultF: string;
    homeTeam: number;
    awayTeam: number;
  } = {
    result1: "1:1",
    result2: "2:2",
    resultE: "E:E",
    resultF: "F:F",
    homeTeam: 0,
    awayTeam: 0,
  };

  res.result1 = `${score.halfTime.homeTeam}:${score.halfTime.awayTeam}`;
  res.result2 = `${score.fullTime.homeTeam}:${score.fullTime.awayTeam}`;
  res.resultE = `${score.extraTime.homeTeam || 0}:${
    score.extraTime.awayTeam || 0
  }`;
  if (score.extraTime.homeTeam === null) {
    res.resultE = "няма";
  }

  let resultFH =
    score.extraTime.homeTeam ||
    score.fullTime.homeTeam ||
    score.halfTime.homeTeam ||
    0;
  let resultFA =
    score.extraTime.awayTeam ||
    score.fullTime.awayTeam ||
    score.halfTime.awayTeam ||
    0;
  res.resultF = `${resultFH}:${resultFA}`;
  res.homeTeam = resultFH;
  res.awayTeam = resultFA;

  return res;
};

export default function OneMatch({ matchId }: { matchId: string }) {
  const [data, setData] = useState(null);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState<ScoreType | null>(null);

  useEffect(() => {
    getOneMatch();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getFinalScore(matchId);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(time + 1);
    }, 10 * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [time]);

  useEffect(() => {
    // console.log("tick");
    // getOneMatch();
  }, [time]);

  useEffect(() => {
    if (data !== null) {
      console.log("new Data:", data);
    }
  }, [data]);

  const getOneMatch = () => {
    var config: AxiosRequestConfig = {
      method: "GET",
      url: `https://api.football-data.org/v2/matches/${matchId}`,
      headers: {
        "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
      },
    };

    axios(config).then((response) => {
      let foo = response.data;
      let newScore = foo.match.score as ScoreType;
      newScore.homeTeam = foo.match.homeTeam;
      newScore.awayTeam = foo.match.awayTeam;

      setData(foo);
      setScore(newScore);
    });
  };

  useEffect(() => {
    console.log("new score:", score);
  }, [score]);

  if (score === null) {
    return null;
  }

  const convertToName = (winner: string) => {
    let res = "";
    if (winner === "HOME_TEAM") {
      res = score.homeTeam.name;
    } else if (winner === "AWAY_TEAM") {
      res = score.awayTeam.name;
    } else {
      res = winner;
    }
    return res;
  };

  const renderMatchScore = () => {
    let winner = convertToName(score.winner);
    let convertedResult = convertResult(score);

    let result1 = convertedResult.result1;
    let result2 = convertedResult.result2;
    let resultЕ = convertedResult.resultE;
    let resultF = convertedResult.resultF;

    return (
      <div>
        <Space direction={"horizontal"}>
          <p>Победител: {winner}</p>
          <p>Първо полувреме: {result1}</p>
          <p>Второ полувреме: {result2}</p>
          <p>Продължение: {resultЕ}</p>
          <p>Краен резултат: {resultF}</p>
        </Space>
      </div>
    );
  };

  return (
    <div>
      {`One Match ${matchId}`}
      {renderMatchScore()}
    </div>
  );
}
