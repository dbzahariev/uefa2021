import Austria from "./flags/Euro/Austria.svg";
import Belgium from "./flags/Euro/Belgium.svg";
import Croatia from "./flags/Euro/Croatia.svg";
import CzechRepublic from "./flags/Euro/CzechRepublic.svg";
import Denmark from "./flags/Euro/Denmark.svg";
import England from "./flags/Euro/England.svg";
import Finland from "./flags/Euro/Finland.svg";
import France from "./flags/Euro/France.svg";
import Germany from "./flags/Euro/Germany.svg";
import Hungary from "./flags/Euro/Hungary.svg";
import Italy from "./flags/Euro/Italy.svg";
import Netherlands from "./flags/Euro/Netherlands.svg";
import NorthMacedonia from "./flags/Euro/NorthMacedonia.svg";
import Poland from "./flags/Euro/Poland.svg";
import Portugal from "./flags/Euro/Portugal.svg";
import Russia from "./flags/Euro/Russia.svg";
import Scotland from "./flags/Euro/Scotland.svg";
import Slovakia from "./flags/Euro/Slovakia.svg";
import Spain from "./flags/Euro/Spain.svg";
import Sweden from "./flags/Euro/Sweden.svg";
import Switzerland from "./flags/Euro/Switzerland.svg";
import Turkey from "./flags/Euro/Turkey.svg";
import Ukraine from "./flags/Euro/Ukraine.svg";
import Wales from "./flags/Euro/Wales.svg";

export const getFlag = (country: string) => {
  let res: any = country;
  let srcForFlag = "";
  if (country !== null) {
    if (country === "Austria") srcForFlag = Austria;
    else if (country === "Belgium") srcForFlag = Belgium;
    else if (country === "Croatia") srcForFlag = Croatia;
    else if (country === "Czech Republic") srcForFlag = CzechRepublic;
    else if (country === "Denmark") srcForFlag = Denmark;
    else if (country === "England") srcForFlag = England;
    else if (country === "Finland") srcForFlag = Finland;
    else if (country === "France") srcForFlag = France;
    else if (country === "Germany") srcForFlag = Germany;
    else if (country === "Hungary") srcForFlag = Hungary;
    else if (country === "Italy") srcForFlag = Italy;
    else if (country === "Netherlands") srcForFlag = Netherlands;
    else if (country === "NorthMacedonia") srcForFlag = NorthMacedonia;
    else if (country === "Poland") srcForFlag = Poland;
    else if (country === "Portugal") srcForFlag = Portugal;
    else if (country === "Russia") srcForFlag = Russia;
    else if (country === "Scotland") srcForFlag = Scotland;
    else if (country === "Slovakia") srcForFlag = Slovakia;
    else if (country === "Spain") srcForFlag = Spain;
    else if (country === "Sweden") srcForFlag = Sweden;
    else if (country === "Switzerland") srcForFlag = Switzerland;
    else if (country === "Turkey") srcForFlag = Turkey;
    else if (country === "Ukraine") srcForFlag = Ukraine;
    else if (country === "Wales") srcForFlag = Wales;

    res = (
      <img
        style={{ width: 15, height: 15, margin: 3 }}
        src={srcForFlag}
        alt={country}
      />
    );
  } else res = null;

  return res;
};
