import React, { useCallback, useState } from "react";
import styled from "styled-components";
import moment from "moment";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import History from "./History";

const CalendarHeader = styled.div`
  text-align: center;
  padding: 10px 0;
  font-size: 1.5em;

  h3 {
    display: inline-block;
    margin: 0 10px;
  }

  span {
    cursor: pointer;
  }

  FontAwesomeIcon {
    cursor: pointer;
  }
`;

const CalendarBody = styled.div`
  max-width: 700px;
  margin: 0 auto;
  border: 1px solid #5e5c56;
`;

const Weekname = styled.div`
  display: inline-block;
  width: calc(100% / 7);
  text-align: center;
  border-right: 1px solid #5e5c56;
  border-bottom: 1px solid #5e5c56;
  padding: 5px 0;
  box-sizing: border-box;

  :last-child {
    border-right: none;
  }
`;
const Week = styled.div`
  border-bottom: 1px solid #5e5c56;

  :last-child {
    border-bottom: none;
  }
`;

const Day = styled.div`
  position: relative;
  display: inline-block;
  width: calc(100% / 7);
  height: 100px;
  padding-top: 40px;
  border-right: 1px solid #5e5c56;
  box-sizing: border-box;
  vertical-align: top;
  cursor: pointer;

  .date {
    position: absolute;
    padding: 2px 3px;
    top: 2px;
    right: 2px;
  }

  .gray {
    color: #9e9e9e;
  }

  .selected {
    background-color: #f00;
    border-radius: 25px;
    color: #fff;
  }

  :last-child {
    border-right: none;
  }
`;

const tempData = {
  history: [
    {
      date: "2022-01-01",
      credit: "10000",
      debit: "1000",
    },
    {
      date: "2022-01-03",
      credit: "0",
      debit: "10000",
    },
    {
      date: "2022-01-07",
      credit: "0",
      debit: "250",
    },
    {
      date: "2022-01-08",
      credit: "500",
      debit: "5000",
    },
    {
      date: "2022-01-11",
      credit: "12000",
      debit: "0",
    },
  ],
  total: {
    credit: "22500",
    debit: "16250",
  },
};

function Calendar() {
  const [date, setDate] = useState(moment());

  const onClickDay = useCallback((date) => {
    console.log(date);
  }, []);

  const generate = () => {
    const today = date;
    const startWeek = today.clone().startOf("month").week();
    const endWeek =
      today.clone().endOf("month").week() === 1
        ? 53
        : today.clone().endOf("month").week();

    let calendar = [];
    for (let week = startWeek; week <= endWeek; week++) {
      calendar.push(
        <Week key={week}>
          {Array(7)
            .fill(0)
            .map((n, i) => {
              let current = today
                .clone()
                .week(week)
                .startOf("week")
                .add(i, "day");
              let isSelected =
                today.format("YYYYMMDD") === current.format("YYYYMMDD")
                  ? "selected"
                  : "";
              let isGrayed =
                current.format("MM") !== today.format("MM") ? "gray" : "";

              return (
                <Day
                  key={i}
                  onClick={() => onClickDay(current.format("YYYYMMDD"))}
                >
                  <span className={`date ${isGrayed} ${isSelected}`}>
                    {current.format("D")}
                  </span>
                  {tempData.history.map((n, i) =>
                    n.date === current.format("YYYY-MM-DD") ? (
                      <History key={n.date} credit={n.credit} debit={n.debit} />
                    ) : null
                  )}
                </Day>
              );
            })}
        </Week>
      );
    }

    return calendar;
  };

  return (
    <div>
      <CalendarHeader>
        <span>
          <FontAwesomeIcon icon={faChevronCircleLeft} />
        </span>
        <h3>{date.format("YYYY-MM")}</h3>
        <span>
          <FontAwesomeIcon icon={faChevronCircleRight} />
        </span>
      </CalendarHeader>
      <CalendarBody>
        <div>
          {Array("SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT").map(
            (n, i) => (
              <Weekname key={i}>{n}</Weekname>
            )
          )}
        </div>
        <div>{generate()}</div>
      </CalendarBody>
    </div>
  );
}

export default Calendar;