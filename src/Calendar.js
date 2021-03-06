import React, { useCallback, useEffect, useReducer, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import moment from "moment";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";

import History from "./History";
import Modal from "./Modal";
import AddModal from "./AddModal";

import { useAccountDispatch, useAccountState } from "./AccountContext";

const CalendarHeader = styled.div`
  position: relative;
  width: 700px;
  text-align: center;
  margin: 0 auto;
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

const AddButton = styled.button`
  position: absolute;
  top: 15px;
  right: 0;
  width: 50px;
  padding: 5px;
  border: 1px solid #bbb;
  border-radius: 15px;
  background-color: #fff;
  cursor: pointer;
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
    padding: 2px 5px;
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
    width: 15px;
    text-align: center;
  }

  :last-child {
    border-right: none;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9000;
  background-color: rgba(0, 0, 0, 0.6);
`;

function Calendar() {
  const [date, setDate] = useState(moment());
  const [total, setTotal] = useState(0);
  const [isOpened, setIsOpened] = useState(false);
  const [isAddOpened, setIsAddOpened] = useState(false);
  const [modalDate, setModalDate] = useState();

  const dispatch = useAccountDispatch();
  const state = useAccountState();
  // ????????? ?????? ??? ?????? ?????? ?????? ????????? ????????????
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:5000/account", {
        params: { date: date.format("YYYY-MM") },
      });

      dispatch({ type: "SET", account: response.data });
    };

    fetchData();
  }, [date, dispatch]);

  // ?????? ??? ??????
  const onClickPrevMonth = useCallback(() => {
    setDate(date.clone().add(-1, "month"));
  }, [date]);

  // ?????? ??? ??????
  const onClickNextMonth = useCallback(() => {
    setDate(date.clone().add(1, "month"));
  }, [date]);

  // ?????? ?????? ??? ????????? ??????
  const onClickDay = useCallback(async (date) => {
    setModalDate(date);
    setIsOpened(true);
  }, []);

  // ????????? ??????
  const onClickCloseModal = useCallback(() => {
    setIsOpened(false);
    setIsAddOpened(false);
  }, []);

  const onClickAddAccount = useCallback(() => {
    setIsAddOpened(true);
  }, []);

  // ?????? ?????? ??????
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
                moment().format("YYYYMMDD") === current.format("YYYYMMDD")
                  ? "selected"
                  : "";
              let isGrayed =
                current.format("MM") !== today.format("MM") ? "gray" : "";

              return (
                <Day
                  key={i}
                  onClick={() => onClickDay(current.format("YYYY-MM-DD"))}
                >
                  <span className={`date ${isGrayed} ${isSelected}`}>
                    {current.format("D")}
                  </span>
                  {/* ??????/?????? ?????? ?????? ??? ?????? */}
                  {state.map((n, i) =>
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
    <>
      <div>
        <CalendarHeader>
          <span>
            <FontAwesomeIcon
              icon={faChevronCircleLeft}
              onClick={onClickPrevMonth}
            />
          </span>
          <h3>{date.format("YYYY-MM")}</h3>
          <span>
            <FontAwesomeIcon
              icon={faChevronCircleRight}
              onClick={onClickNextMonth}
            />
          </span>
          <AddButton type="button" onClick={onClickAddAccount}>
            ??????
          </AddButton>
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
      {isOpened && (
        <>
          <Backdrop onClick={onClickCloseModal}></Backdrop>
          <Modal modalDate={modalDate} />
        </>
      )}
      {isAddOpened && (
        <>
          <Backdrop onClick={onClickCloseModal}></Backdrop>
          <AddModal onClickCloseModal={onClickCloseModal} />
        </>
      )}
    </>
  );
}

export default Calendar;
