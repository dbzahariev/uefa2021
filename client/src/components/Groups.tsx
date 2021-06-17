import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { Button, Space, Table } from "antd";
import { translateTeamsName } from "../helpers/Translate";
import { useParams } from "react-router-dom";

const competitionsIds = {
  Uefa: 2018,
  Premier: 2021,
};

type OneRow = {
  key: string;
  name: string;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  position: number;
};

type OneGroup = {
  name: string;
  table: OneRow[];
};

export default function Groups() {
  const [groups, setGroups] = useState<OneGroup[]>([]);

  let params: any = useParams();

  useEffect(() => {
    getAllStandings();
  }, []);

  const getAllStandings = () => {
    var config: AxiosRequestConfig = {
      method: "GET",
      url: `https://api.football-data.org/v2/competitions/${competitionsIds.Uefa}/standings`,
      headers: {
        "X-Auth-Token": "35261f5a038d45029fa4ae0abc1f2f7a",
      },
    };

    axios(config)
      .then(function (response) {
        let data: any = response.data.standings;
        let allGroups = [];

        for (let i = 0; i < data.length; i++) {
          let group = data[i];
          let groupToAdd: OneGroup = {
            name: group.group as string,
            table: [],
          };
          groupToAdd.name = groupToAdd.name[groupToAdd.name.length - 1];

          for (let j = 0; j < group.table.length; j++) {
            let teams = group.table[j];
            let teamsToAdd: OneRow = {
              key: teams.team.name,
              name: translateTeamsName(teams.team.name),
              playedGames: teams.playedGames,
              won: teams.won,
              draw: teams.draw,
              lost: teams.lost,
              points: teams.points,
              position: teams.position,
            };
            groupToAdd.table.push(teamsToAdd);
          }
          allGroups.push(groupToAdd);
        }
        setGroups(allGroups);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    let groupName = params.groupName;
    if (groupName && groupName !== "All") {
      let el = document.getElementById(groupName);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [groups, params.groupName]);

  const renderGroups = () => {
    const oneGroupTable = (oneGroup: OneGroup) => {
      const columns = [
        {
          title: "Поз",
          dataIndex: "position",
          key: "position",
          render: (el: number) => {
            return (
              <span
                style={{
                  border: `2px solid ${
                    el.toString() === "1" || el.toString() === "2"
                      ? "#4285F4"
                      : el.toString() === "3"
                      ? "#FA7B17"
                      : "black"
                  }`,
                }}
              >
                {el}
              </span>
            );
          },
        },
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          width: window.screen.width * 0.2,
        },
        {
          title: "ИИ",
          dataIndex: "playedGames",
          key: "playedGames",
        },
        {
          title: "П",
          dataIndex: "won",
          key: "won",
        },
        {
          title: "Р",
          dataIndex: "draw",
          key: "draw",
        },
        {
          title: "З",
          dataIndex: "lost",
          key: "lost",
        },
        {
          title: "Т",
          dataIndex: "points",
          key: "points",
        },
      ];
      return (
        <Table
          key={`Group ${oneGroup.name}`}
          title={() => (
            <p style={{ textAlign: "center" }}>{`Група ${oneGroup.name}`}</p>
          )}
          dataSource={oneGroup.table}
          columns={columns}
          pagination={false}
          bordered
        />
      );
    };

    return (
      <div>
        {groups.map((group) => {
          return (
            <div key={`Group ${group.name}`} id={`Group ${group.name}`}>
              <Space direction={"horizontal"}>{oneGroupTable(group)}</Space>
            </div>
          );
        })}
        <Button
          onClick={() => {
            window.scrollTo(0, 0);
            // $("body").scrollTop(0);
          }}
        >
          Начало
        </Button>
      </div>
    );
  };

  return <div>{renderGroups()}</div>;
}
