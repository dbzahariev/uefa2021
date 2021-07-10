import { Space, Spin, Switch } from "antd";
import { useEffect, useRef, useState } from "react";
import AutoRefresh, { AutoRefreshInterval } from "./AutoRefresh";
import { LoadingOutlined } from "@ant-design/icons";
import OneMatchTable from "./OneMatchTable";

import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import {
  getAllFinalWinner,
  getAllMatches,
  getPoints,
  stylingTable,
  reloadData,
  getAllUsers,
  MatchType,
  UsersType,
} from "../helpers/OtherHelpers";

export const getMatchesForView = (
  matches: MatchType[],
  showGroups: boolean
) => {
  let res = [...matches];
  if (showGroups === false) {
    let kk = res.filter(
      (el) => (el.group || "").toLowerCase().indexOf("group") === -1
    );
    res = kk;
  }

  return res;
};

export default function AllMatches2({ refresh }: { refresh: Function }) {
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [users, setUsers] = useState<UsersType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGroups, setShowGroups] = useState(false);

  let intervalRef = useRef<any>();

  useEffect(() => {
    if (AutoRefreshInterval >= 1 && AutoRefreshInterval !== "disable") {
      intervalRef.current = setInterval(() => {
        reloadData(setMatches, getAllUsers, setUsers, users, matches);
      }, AutoRefreshInterval * 1000);
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [AutoRefreshInterval]);

  useEffect(() => {
    if (matches.length === 0) {
      getAllMatches(setMatches);
    }
  }, [matches.length]);

  useEffect(() => {
    getAllUsers(setUsers);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getAllFinalWinner(users);
    stylingTable(users);
    // eslint-disable-next-line
  }, [users]);

  useEffect(() => {
    if (users.length > 0 && matches.length > 0) {
      setLoading(false);
      let res = getPoints(users, matches);
      res.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      setUsers(res);
    } else {
      setLoading(true);
    }
    // eslint-disable-next-line
  }, [users.length, matches.length]);

  useEffect(() => {
    stylingTable(users);
  }, [showGroups, users]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
            size="large"
            style={{ width: "100%", height: "100%", alignItems: "center" }}
          />
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return null;
  }

  return (
    <>
      <AutoRefresh refresh={refresh} />
      <div>
        <Space direction={"horizontal"} style={{ margin: 5, paddingTop: 10 }}>
          <span style={{ width: "50%" }}>Показване на групова фаза</span>
          <Switch
            onChange={(newValue: any) => setShowGroups(newValue)}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={showGroups}
          />
        </Space>
      </div>
      {/* <div style={{ width: 4000 }}>  */}
      <div>
        <Space direction={"horizontal"}>
          <OneMatchTable
            AllMatches={getMatchesForView(matches, showGroups)}
            users={users}
          />
        </Space>
      </div>
    </>
  );
}
