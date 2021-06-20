import { Space } from "antd";
import React from "react";

export default function Rules() {
  const styleHeader: React.CSSProperties = {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
    margin: 0,
  };

  const styleMiniHeader: React.CSSProperties = {
    fontSize: 20,
    fontWeight: "bold",
    padding: 5,
    paddingRight: 0,
    margin: 0,
  };

  const styleNormal: React.CSSProperties = {
    fontSize: 20,
    fontWeight: "normal",
    textAlign: "justify",
    padding: 10,
    margin: 0,
    paddingTop: 0,
  };

  return (
    <div>
      <Space direction={"vertical"} size={0}>
        <p style={styleHeader}>Регламент</p>
        <p style={styleNormal}>
          Прогнози за всички мачове се дават на сайта{" "}
          <a href="https://deuro.herokuapp.com/">www.deuro.herokuapp.com</a>.
          <br />
          Ако не е въведена прогноза до началото на сррещата, тя може да се даде
          до 15 мин след началото на срещата, но тогава се получават 50% от
          полащите се точки.
          <br />
          По уважителни причини може да се обадите на Димитър и той ще ги въведе
          в системата.
        </p>
        <p style={styleHeader}>Точкуване</p>
        <p style={styleMiniHeader}>Групова фаза:</p>
        <p style={styleNormal}>
          1 точка за познат знак
          <br />
          2 точки за позната голова разлика или за познат равен резултат –
          например при залог 2:1, резултат от мача 1:0 се дават 2 точки, както и
          при залог 1:1 и резултат от мача 2:2
          <br />3 точки за познат точен резултат
        </p>
        <p style={styleNormal}>
          След груповата фаза се дава прогноза и за победител от двубоя след
          редовното време при равен резултат, като се добавя 1 точка за познат
          отбор, който продължава напред в турнира.
        </p>
        <span>
          <span style={styleMiniHeader}>Осминафинали</span>
          <span style={styleNormal}>
            – полученият брой точки не се променя.
          </span>
        </span>

        <span>
          <span style={styleMiniHeader}>Четвъртфинали</span>
          <span style={styleNormal}>
            - полученият брой точки се умножава по {1.5}
          </span>
        </span>

        <span>
          <span style={styleMiniHeader}>Полуфинали</span>
          <span style={styleNormal}>
            - полученият брой точки се умножава по {2}
          </span>
        </span>

        <span>
          <span style={styleMiniHeader}>Финал</span>
          <span style={styleNormal}>
            - полученият брой точки се умножава по {3}
          </span>
        </span>
        <br />
        <p style={styleNormal}>
          Най-важното правило – да се забавляваме и победителя по традиция да
          черпи със сладолед! 😊
        </p>
      </Space>
    </div>
  );
}
