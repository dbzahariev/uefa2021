// eslint-disable-next-line
import axios from "axios";
// eslint-disable-next-line
import { useEffect, useState } from "react";
import "./App.css";
// eslint-disable-next-line
import AllCompetition from "./components/AllCompetition";
// eslint-disable-next-line
import Groups from "./components/Groups";
// eslint-disable-next-line
import AllMatches from "./components/AllMatches";
// eslint-disable-next-line
import OneMatch from "./components/OneMatch";
import "antd/dist/antd.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { Space } from "antd";

export const competitionsIds = {
  Uefa: 2018,
  Premier: 2021,
};

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
          <Link to="/allMatches">Всички мачове</Link>
          <Link to="/match/303759">Mач</Link>
        </Space>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/" exact>
            <AllMatches refresh={refresh} />
          </Route>
          <Route path="/allMatches">
            <AllMatches refresh={refresh} />
          </Route>
          <Route path="/match/:matchId">
            <MatchWithParams />
          </Route>
        </Switch>
      </div>
    </Router>
  );
  // return <div className="app">{<OneMatch matchId="303759" />}</div>;
  return <div className="app">{<AllMatches refresh={refresh} />}</div>;
}
