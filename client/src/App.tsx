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

export const competitionsIds = {
  Uefa: 2018,
  Premier: 2021,
};

export default function App() {
  const [reload, setReload] = useState(0);

  const refresh = () => {
    setReload(reload + 1);
  };
  // return <div className="app">{<OneMatch matchId="303759" />}</div>;
  return <div className="app">{<AllMatches refresh={refresh} />}</div>;
}
