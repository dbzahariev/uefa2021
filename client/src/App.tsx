import { useEffect, useState } from "react";
import "./App.css";
// eslint-disable-next-line
import AllCompetition from "./components/AllCompetition";
import Groups from "./components/Groups";
import AllMatches, { MatchType, UsersType } from "./components/AllMatches";
import OneMatch from "./components/OneMatch";
// eslint-disable-next-line
import PlayersPoints from "./components/PlayersPoints";
import "antd/dist/antd.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  // eslint-disable-next-line
  Redirect,
} from "react-router-dom";
import { Space } from "antd";
import axios, { AxiosRequestConfig } from "axios";

const competitionsIds = {
  Uefa: 2018,
  Premier: 2021,
};

export const selectedCompetition = competitionsIds.Premier;

function MatchWithParams() {
  let params: any = useParams();

  return <OneMatch matchId={params.matchId} />;
}

export default function App() {
  const [reload, setReload] = useState(0);
  // eslint-disable-next-line
  const [users, setUsers] = useState<UsersType[]>([]);
  // eslint-disable-next-line
  const [matches, setMatches] = useState<MatchType[]>([]);

  useEffect(() => {
    // fetchUsers().then((users) => setUsers(users));
    // fetchMatches().then((matches) => setMatches(matches));
  }, []);

  // eslint-disable-next-line
  const fetchUsers = async () => {
    let res = await axios({
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
      };
      if (el._id) {
        userToAdd.id = el._id;
      }
      newUsers.push(userToAdd);
    });
    return newUsers;
  };

  // eslint-disable-next-line
  const fetchMatches = async () => {
    let config: AxiosRequestConfig = {
      method: "GET",
      url: `https://api.football-data.org/v2/competitions/${selectedCompetition}/matches`,
      headers: {
        "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
      },
    };

    let response = await axios(config);

    let data: MatchType[] = response.data.matches;
    data = data.slice(0, 3); // limit First 3
    let matches: MatchType[] = [];

    data.forEach((el, index) => {
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
    return matches;
  };

  const refresh = () => {
    setReload(reload + 1);
  };

  return (
    <Router>
      <div>
        <Space direction={"horizontal"}>
          <Link to="/">Home</Link>
          <Link to="/groups">Групи</Link>
          <Link to="/allmatches">Всички мачове</Link>
          <Link to="/match/303759">Mач</Link>
        </Space>

        <Switch>
          <Route path="/" exact>
            <AllMatches refresh={refresh} />
          </Route>
          <Route path="/allmatches">
            <AllMatches refresh={refresh} />
          </Route>
          <Route path="/match/:matchId">
            <MatchWithParams />
          </Route>
          <Route path="/groups">
            <Groups />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
