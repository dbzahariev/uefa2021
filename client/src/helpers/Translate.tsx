let teams = require("./teams.json");

export const translateTeamsName = (team: string): string => {
  if (team === "LAST_16") {
    // debugger;
  }
  let kk: string = teams[team];
  if ((team || "").toLocaleLowerCase().indexOf("group") > -1) {
    let foo = team.split(" ");
    let dd = teams[foo[0]];
    dd += ` ${foo[1]}`;
    kk = dd;
  }
  return kk ? kk : team;
};
