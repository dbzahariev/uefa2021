let teams = require("./teams.json");

export const translateTeamsName = (team: string): string => {
  let kk: string = teams[team];
  return kk ? kk : team;
};
