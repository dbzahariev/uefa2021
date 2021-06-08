import { useState } from "react";
import "./App.css";
// eslint-disable-next-line
import AllCompetition from "./components/AllCompetition";
import Groups from "./components/Groups";
import AllMatches from "./components/AllMatches";
import OneMatch from "./components/OneMatch";
import PlayersPoints from "./components/PlayersPoints";
import "antd/dist/antd.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  Redirect,
} from "react-router-dom";
import { Space } from "antd";

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

  const refresh = () => {
    setReload(reload + 1);
  };

  return (
    <Router>
      <div>
        <Space direction={"horizontal"}>
          <Link to="/">Home</Link>
          <Link to="/groups">Групи</Link>
          <Link to="/allMatches">Всички мачове</Link>
          <Link to="/match/303759">Mач</Link>
          {/* <Link to="/points">Toчки</Link> */}
        </Space>

        <Switch>
          <Route path="/" exact>
            <Redirect to="/allMatches" />
          </Route>
          <Route path="/allMatches">
            <AllMatches refresh={refresh} />
          </Route>
          <Route path="/match/:matchId">
            <MatchWithParams />
          </Route>
          <Route path="/groups">
            <Groups />
          </Route>
          <Route path="/points">
            <PlayersPoints />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
