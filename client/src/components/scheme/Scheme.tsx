import axios, { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";
import { selectedCompetition } from "../../App";
import { MatchType } from "../AllMatches2";
import OneMatchInScheme from "./OneMatchInScheme";
import Separator from "./separator.svg";
import $ from "jquery";

export default function Scheme() {
  const [matches, setMatches] = useState<MatchType[]>([]);

  useEffect(() => {
    getAllMatches();
  }, []);

  const getAllMatches = () => {
    var config: AxiosRequestConfig = {
      method: "GET",
      url: `https://api.football-data.org/v2/competitions/${selectedCompetition}/matches`,
      // url: `https://api.football-data.org/v2/matches/${325091}`,
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
          if ((matchToAdd.group || "").indexOf("Group") === -1) {
            matches.push(matchToAdd);
          }
        });

        setMatches(matches);
      })
      .catch((error) => console.log(error));
  };

  if (matches.length === 0) {
    return null;
  }

  const renderLast16 = () => {
    let matchesIn16 = matches.filter((match) => match.group === "LAST_16");

    return (
      <div style={{ height: "680px" }}>
        <OneMatchInScheme match={matchesIn16[0]} />
        <OneMatchInScheme match={matchesIn16[1]} />
        <OneMatchInScheme match={matchesIn16[2]} />
        <OneMatchInScheme match={matchesIn16[3]} />
        <OneMatchInScheme match={matchesIn16[4]} />
        <OneMatchInScheme match={matchesIn16[5]} />
        <OneMatchInScheme match={matchesIn16[6]} />
        <OneMatchInScheme match={matchesIn16[7]} />
      </div>
    );
  };

  const renderLast8 = () => {
    let matchesIn8 = matches.filter((match) => match.group === "QUARTER_FINAL");

    return (
      <div style={{ height: "680px" }}>
        <div style={{ marginTop: "23.8%" }}>
          <OneMatchInScheme match={matchesIn8[0]} />
        </div>
        <div style={{ marginTop: "50.9%" }}>
          <OneMatchInScheme match={matchesIn8[1]} />
        </div>
        <div style={{ marginTop: "50.9%" }}>
          <OneMatchInScheme match={matchesIn8[2]} />
        </div>
        <div style={{ marginTop: "50.9%" }}>
          <OneMatchInScheme match={matchesIn8[3]} />
        </div>
      </div>
    );
  };

  const renderLast4 = () => {
    let matchesIn8 = matches.filter((match) => match.group === "SEMI_FINAL");

    return (
      <div style={{ height: "680px" }}>
        <div style={{ marginTop: "70.9%" }}>
          <OneMatchInScheme match={matchesIn8[0]} />
        </div>
        <div style={{ marginTop: "145.5%" }}>
          <OneMatchInScheme match={matchesIn8[1]} />
        </div>
      </div>
    );
  };

  const renderLast2 = () => {
    let matchesIn8 = matches.filter((match) => match.group === "FINAL");

    return (
      <div style={{ height: "680px" }}>
        <div style={{ marginTop: "165.2%" }}>
          <OneMatchInScheme match={matchesIn8[0]} />
        </div>
      </div>
    );
  };

  const returnSeparator16 = () => {
    let width = "60px";
    let height = "86px";
    return (
      <div
        style={{
          marginTop: "10.4%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src={Separator}
          alt="Separator"
          style={{ height: height, width: width, objectFit: "fill" }}
        />
        <img
          style={{
            marginTop: "84px",
            height: height,
            width: width,
            objectFit: "fill",
          }}
          src={Separator}
          alt="Separator"
        />
        <img
          style={{
            marginTop: "84px",
            height: height,
            width: width,
            objectFit: "fill",
          }}
          src={Separator}
          alt="Separator"
        />
        <img
          style={{
            marginTop: "84px",
            height: height,
            width: width,
            objectFit: "fill",
          }}
          src={Separator}
          alt="Separator"
        />
      </div>
    );
  };

  const returnSeparator8 = () => {
    return (
      <div
        style={{
          marginTop: "18.9%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src={Separator}
          alt="Separator"
          style={{ height: "171.8px", objectFit: "cover" }}
        />
        <img
          src={Separator}
          alt="Separator"
          style={{
            marginTop: "169px",
            height: "171.8px",
            objectFit: "cover",
          }}
        />
      </div>
    );
  };

  const returnSeparator4 = () => {
    return (
      <div
        style={{
          marginTop: "35.6%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src={Separator}
          alt="Separator"
          style={{ height: "345px", objectFit: "unset" }}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        margin: 10,
        width: "500px",
        display: "flex",
      }}
    >
      {renderLast16()}
      {returnSeparator16()}
      {renderLast8()}
      {returnSeparator8()}
      {renderLast4()}
      {returnSeparator4()}
      {renderLast2()}
    </div>
  );
}
