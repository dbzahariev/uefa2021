import { Space } from "antd";
import React from "react";

export default function Rules() {
  const styleHeader: React.CSSProperties = {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
  };

  const styleMiniHeader: React.CSSProperties = {
    fontSize: 20,
    fontWeight: "bold",
    padding: 5,
    paddingRight: 0,
  };

  const styleNormal: React.CSSProperties = {
    fontSize: 20,
    fontWeight: "normal",
    textAlign: "justify",
    padding: 10,
  };

  return (
    <div>
      <Space direction={"vertical"}>
        <p style={styleHeader}>Правила</p>
        <p style={styleNormal}>
          Прогнози за всички мачове се дават на сайта{" "}
          <a href="https://deuro.herokuapp.com/">www.deuro.herokuapp.com</a>{" "}
          преди началото на мача. От първия съдийски сигнал, клетките за
          прогнози се заключват и участниците не могат да дават прогнози.
        </p>
        <p style={styleHeader}>Точкуване</p>
        <p style={styleMiniHeader}>Групова фаза:</p>
        <p style={styleNormal}>
          1 точка за познат знак
          <br />
          2 точки за позната разлика и равен резултат – например при залог 2:1,
          резултат от мача 1:0 се дават 2 точки, както и при залог 1:1 и
          резултат от мача 2:2
          <br />3 точки за познат точен резултат
        </p>
        <p style={styleNormal}></p>

        <Space direction="horizontal" size={0}>
          <span>
            <span style={styleMiniHeader}>Осминафинали</span>
            <span style={styleNormal}>
              – в допълнение на стандартните точки, се добавя 1 точка за познат
              победител от мача, който продължава напред в елиминационната фаза.
              Максимумът точки става 4 броя – 3 точки за познат точен резултат и
              една точка за познат отбор, който продължава.
            </span>
          </span>
        </Space>
        <p style={styleNormal}>
          1 точка за познат знак <br />
          2 точки за позната разлика и равен резултат <br />
          3 точки за познат точен резултат 1 допълнителна точка за познат отбор,
          който продължава след елиминациите
          <br />1 точка за познат знак
        </p>

        <Space direction="horizontal" size={0}>
          <span>
            <span style={styleMiniHeader}>Четвъртфинали</span>
            <span style={styleNormal}>
              – въвежда се коефициент на точките 1.5 и така максимумът точки,
              които могат да се спечелят, става 5.5 за точен резултат и познат
              отбор, който продължава
            </span>
          </span>
        </Space>
        <p style={styleNormal}>
          1.5 точка за познат знак <br />
          3 точки за позната разлика и равен резултат <br />
          4.5 точки за познат точен резултат
          <br />1 допълнителна точка за познат отбор, който продължава след
          елиминациите
        </p>

        <Space direction="horizontal" size={0}>
          <span>
            <span style={styleMiniHeader}>Полуфинали</span>
            <span style={styleNormal}>
              – коефициент на точките x 2 и така максимумът точки, които могат
              да се спечелят, става 7 за точен резултат и познат отбор, който
              продължава
            </span>
          </span>
        </Space>
        <p style={styleNormal}>
          2 точки за познат знак <br />
          4 точки за позната разлика и равен резултат <br />
          6 точки за познат точен резултат
          <br />1 допълнителна точка за познат отбор, който продължава след
          елиминациите
        </p>

        <Space direction="horizontal" size={0}>
          <span>
            <span style={styleMiniHeader}>Финал</span>
            <span style={styleNormal}>
              – коефициент на точките x 3 и така максимумът точки, които могат
              да се спечелят, става 10 за точен резултат и познат победител от
              мача
            </span>
          </span>
        </Space>
        <p style={styleNormal}>
          3 точки за познат знак <br />
          6 точки за позната разлика и равен резултат <br />
          9 точки за познат точен резултат
          <br />1 допълнителна точка за познат победилтел
        </p>

        <p style={styleNormal}>
          Прогноза преди началото на първенството за шампион – всеки дава своята
          прогноза кой ще стане шампион на EURO2020 преди старта на първия мач.
          Позналият взима 10 точки.
        </p>
        <p style={styleNormal}>
          Най-важното правило – да се забавляваме и победителя по традиция да
          черпи със сладолед! 😊
        </p>
        {/* <p style={styleHeader}>EURO2020</p> */}
      </Space>
    </div>
  );
}
