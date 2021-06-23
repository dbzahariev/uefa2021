import { useState } from "react";
import "./App.css";
import Groups from "./components/Groups";
import AllMatches from "./components/AllMatches2";
import OneMatch from "./components/OneMatch";
import "antd/dist/antd.css";

import {
  BrowserRouter as Router,
  Route,
  Link,
  useParams,
  Switch,
} from "react-router-dom";
import { Space } from "antd";
import Rules from "./components/Rules";
import AddNewBet from "./components/AddNewBet";
import Chat from "./components/chat/Chat";
import Scheme from "./components/scheme/Scheme";

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

  const refresh = () => {
    setReload(reload + 1);
  };

  return (
    <Router>
      <div>
        <Space direction={"horizontal"} size={"large"}>
          <Link style={{ fontSize: "15px" }} to="/">
            Всички мачове
          </Link>
          <Link style={{ fontSize: "15px" }} to="/addbet">
            Прогнози
          </Link>
          <Link to="/groups/all" style={{ fontSize: "15px" }}>
            Групи
          </Link>
          <Link to="/rules" style={{ fontSize: "15px" }}>
            Регламент
          </Link>
          <Link to="/chatroom" style={{ fontSize: "15px" }}>
            Чат
          </Link>
          <Link to="/scheme" style={{ fontSize: "15px" }}>
            Схема
          </Link>
        </Space>
      </div>
      <Switch>
        <Route path="/match/:matchId" exact component={MatchWithParams} />
        <Route path="/groups/:groupName" exact component={Groups}></Route>
        <Route path="/rules" exact component={Rules}></Route>
        <Route path="/addbet" exact component={AddNewBet}></Route>
        <Route path="/chatroom" exact component={Chat} />
        <Route path="/scheme" exact component={Scheme} />
        <Route path="/" exact>
          <AllMatches refresh={refresh} />
        </Route>
      </Switch>
    </Router>
  );
}
