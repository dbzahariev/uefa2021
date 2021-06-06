// eslint-disable-next-line
import axios from "axios";
// eslint-disable-next-line
import { useEffect, useState } from "react";
import "./App.css";
// eslint-disable-next-line
import AllCompetition from "./components/AllCompetition";
// eslint-disable-next-line
import Groups from "./components/Groups";
import AllMatches from "./components/AllMatches";
import "antd/dist/antd.css";

export const competitionsIds = {
  Uefa: 2018,
  Premier: 2021,
};

export default function App() {
  return <div className="app">{<AllMatches />}</div>;
}
