import { useState } from "react";
import "./App.css";
// eslint-disable-next-line
import Groups from "./components/Groups";
import AllMatches from "./components/AllMatches";
import OneMatch from "./components/OneMatch";
// eslint-disable-next-line
import "antd/dist/antd.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { Space } from "antd";
import Rules from "./components/Rules";

const competitionsIds = {
  Uefa: 2018,
  Premier: 2021,
};

export const selectedCompetition = competitionsIds.Uefa;

function MatchWithParams() {
  let params: any = useParams();

  return <OneMatch matchId={params.matchId} />;
}

export default function App() {
  const [reload, setReload] = useState(0);

  // eslint-disable-next-line
  // const fetchUsers = async () => {
  //   let res = await axios({
  //     method: "GET",
  //     withCredentials: true,
  //     url: "/api",
  //   });
  //   let users = [...res.data] as UsersType[];
  //   let newUsers: UsersType[] = [];
  //   users.forEach((el) => {
  //     let userToAdd: UsersType = {
  //       name: el.name,
  //       bets: el.bets,
  //     };
  //     if (el._id) {
  //       userToAdd.id = el._id;
  //     }
  //     newUsers.push(userToAdd);
  //   });
  //   return newUsers;
  // };

  // eslint-disable-next-line
  // const fetchMatches = async () => {
  //   let config: AxiosRequestConfig = {
  //     method: "GET",
  //     url: `https://api.football-data.org/v2/competitions/${selectedCompetition}/matches`,
  //     headers: {
  //       "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
  //     },
  //   };

  //   let response = await axios(config);

  //   let data: MatchType[] = response.data.matches;
  //   data = data.slice(0, 55); // limit First 3
  //   let matches: MatchType[] = [];

  //   data.forEach((el, index) => {
  //     let score = el.score;
  //     let matchToAdd: MatchType = {
  //       number: index + 1,
  //       key: matches.length || 0,
  //       id: el.id,
  //       homeTeam: el.homeTeam,
  //       awayTeam: el.awayTeam,
  //       utcDate: el.utcDate,
  //       group: el.group,
  //       winner: score?.winner || "",
  //       homeTeamScore: score?.fullTime?.homeTeam || 0,
  //       awayTeamScore: score?.fullTime?.awayTeam || 0,
  //     };
  //     matches.push(matchToAdd);
  //   });
  //   return matches;
  // };

  const refresh = () => {
    setReload(reload + 1);
  };

  return (
    <Router>
      <div>
        <Space direction={"horizontal"}>
          <Link to="/">Всички мачове</Link>
          <Link to="/groups/all">Групи</Link>
          <Link to="/rules">Регламент</Link>
          {/* <Link to="/match/303759">Mач</Link> */}
        </Space>

        <Switch>
          <Route path="/match/:matchId">
            <MatchWithParams />
          </Route>
          <Route path="/groups/:groupName">
            <Groups />
          </Route>
          <Route path="/rules">
            <Rules />
          </Route>
          <Route path="/">
            <AllMatches refresh={refresh} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
