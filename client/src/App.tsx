import { useEffect, useState } from "react";
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
  Redirect,
} from "react-router-dom";
import { Space } from "antd";
import Rules from "./components/Rules";
import AddNewBet from "./components/AddNewBet";
import Chat from "./components/chat/Chat";
import Scheme from "./components/scheme/Scheme";
import Ranking from "./components/ranking/Ranking";

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

  let fontSize = "20px";

  const [dimensions, setDimensions] = useState({
    widthI: window.innerWidth,
    heightI: window.innerHeight,
    widthO: window.outerWidth,
    heightO: window.outerHeight,
  });

  useEffect(() => {
    const updateWindowDimensions = () => {
      setDimensions({
        widthI: window.innerWidth,
        heightI: window.innerWidth,
        widthO: window.outerWidth,
        heightO: window.outerWidth,
      });
    };

    window.addEventListener("resize", updateWindowDimensions);
  }, []);

  return (
    <Router>
      <div
        style={{
          position: "sticky",
          width: `${dimensions.widthO * 0.99}px`,
          zIndex: 2,
          top: 0,
        }}
      >
        <Space
          direction={"horizontal"}
          size={"large"}
          style={{ height: `${dimensions.heightO * 0.06}px` }}
        >
          <Link
            style={{ fontSize: fontSize, width: 150, display: "block" }}
            to="/"
          >
            Всички мачове
          </Link>
          <Link style={{ fontSize: fontSize }} to="/addbet">
            Прогнози
          </Link>
          <Link to="/groups/all" style={{ fontSize: fontSize }}>
            Групи
          </Link>
          <Link to="/rules" style={{ fontSize: fontSize }}>
            Регламент
          </Link>
          <Link to="/chatroom" style={{ fontSize: fontSize }}>
            Чат
          </Link>
          <Link to="/scheme" style={{ fontSize: fontSize }}>
            Схема
          </Link>
          <Link to="/ranking" style={{ fontSize: fontSize }}>
            Подредба
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
        <Route path="/ranking" exact component={Ranking} />
        <Route path="/allMatches" exact>
          <AllMatches refresh={refresh} />
        </Route>
        <Route exact path="/">
          <Redirect to="/ranking" />
        </Route>
      </Switch>
    </Router>
  );
}
