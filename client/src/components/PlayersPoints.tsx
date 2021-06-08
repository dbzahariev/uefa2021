import axios, { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";
import { selectedCompetition } from "../App";
import { MatchType } from "./AllMatches";

export default function PlayersPoints() {
  const [matches, setMatches] = useState<MatchType[]>([]);

  useEffect(() => {
    if (matches.length === 0) {
      getAllMatches();
    }
  }, [matches.length]);

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
        data = data.slice(0, 3); // limit First 3
        let matches: MatchType[] = [];

        data.forEach((el: MatchType, index) => {
          let score = el.score;
          let matchToAdd: MatchType = {
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
        setMatches(matches);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return <div>{"pp1"}</div>;
}
