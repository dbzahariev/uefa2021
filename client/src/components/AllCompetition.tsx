import axios, { AxiosRequestConfig } from "axios";
import React, { useEffect } from "react";
import { competitionsIds } from "../App";
import { translateTeamsName } from "../helpers/Translate";

export default function AllCompetition() {
  // eslint-disable-next-line
  const getAllFetch = () => {
    let myHeaders: Headers = new Headers();
    myHeaders.append("X-Auth-Token", "35261f5a038d45029fa4ae0abc1f2f7a");

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch("https://api.football-data.org/v2/matches/285418", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  // eslint-disable-next-line
  const convertDate = (utcDate: Date) => {
    return new Date(utcDate).toLocaleString(window.navigator.language);
  };

  // eslint-disable-next-line
  const getAllTeams = () => {
    var config: AxiosRequestConfig = {
      method: "GET",
      url: `https://api.football-data.org/v2/competitions/${competitionsIds.Uefa}/teams`,
      headers: {
        "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
      },
    };

    axios(config)
      .then(function (response) {
        let data: TeamType[] = response.data.teams;
        let teams: TeamType[] = [];

        type TeamType = {
          crestUrl: string;
          id: Number;
          name: string;
        };

        data.forEach((team) => {
          teams.push({
            name: translateTeamsName(team.name),
            crestUrl: team.crestUrl,
            id: team.id,
          });
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // eslint-disable-next-line
  const getAllMatches = () => {
    var config: AxiosRequestConfig = {
      method: "GET",
      url: `https://api.football-data.org/v2/competitions/${competitionsIds.Uefa}/matches`,
      headers: {
        "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
      },
    };

    axios(config)
      .then(function (response) {
        let data: any = response.data.matches;
        let matches: any[] = [];
        data.forEach((el: any) => {
          matches.push(el);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // eslint-disable-next-line
  const getAllAxios = () => {
    var config: AxiosRequestConfig = {
      method: "GET",
      url: `https://api.football-data.org/v2/matches/285418`,
      headers: {
        "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
      },
    };

    axios(config)
      .then(function (response) {
        let data: any = response.data;
        debugger;
        let matches: any[] = [];
        data.forEach((el: any) => {
          matches.push(el);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllMatches();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <p>hi</p>
    </div>
  );
}
