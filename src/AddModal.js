import React, { useCallback, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import moment from "moment";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./css/datepicker.css";
import { useAccountDispatch } from "./AccountContext";

const ModalStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-250px, -150px);
  width: 500px;
  border: 1px solid #333;
  padding: 15px;
  background-color: #fff;
  z-index: 9999;
`;

const Row = styled.div``;

const Col = styled.div`
  display: inline-block;
  width: calc(100% / 4);
  padding: 5px;
  box-sizing: border-box;

  & > * {
    width: 100%;
    height: 30px;
    box-sizing: border-box;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: right;
  margin-top: 15px;
  text-align: center;
  padding: 0 5px;
`;

const Button = styled.div`
  flex: 0 0 100px;
  padding: 5px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  box-sizing: border-box;

  &.submit {
    border: 1px solid #a1a1a1;
    margin-right: 10px;
  }

  &.cancel {
    background-color: #f00;
    color: #fff;
    border: 1px solid #f00;
  }
`;

function AddModal({ onClickCloseModal }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [accountData, setAccountData] = useState({
    type: "credit",
    amount: 0,
    description: "",
  });
  const [savedAccount, setSavedAccount] = useState({
    date: "",
    credit: "",
    debit: "",
  });

  const dispatch = useAccountDispatch();

  const onChangeData = useCallback(
    (e) => {
      const { name, value } = e.target;
      setAccountData({
        ...accountData,
        [name]: value,
      });
    },
    [accountData]
  );

  const onClickSubmit = useCallback(async () => {
    const date = moment(selectedDate).format("YYYY-MM-DD");
    const data = {
      ...accountData,
      date: date,
    };

    const response = await axios.post(
      "http://193.122.105.156:5000/account/save",
      data
    );

    if (response.data === "OK") {
      setSavedAccount({
        ...savedAccount,
        date: date,
        [accountData.type]: accountData.amount,
      });

      const response2 = await axios.get("http://193.122.105.156:5000/account", {
        params: { date: moment().format("YYYY-MM") },
      });
      dispatch({ type: "SET", account: response2.data });

      onClickCancel();
    }
  }, [savedAccount, accountData, selectedDate, dispatch]);

  const onClickCancel = useCallback(() => {
    onClickCloseModal(false);
  }, [onClickCloseModal]);

  return (
    <>
      <ModalStyle>
        <Row>
          <Col>날짜</Col>
          <Col>구분</Col>
          <Col>금액</Col>
          <Col>내역</Col>
        </Row>
        <Row>
          <Col>
            <Datepicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </Col>
          <Col>
            <select name="type" onChange={onChangeData}>
              <option value="credit">입금</option>
              <option value="debit">지출</option>
            </select>
          </Col>
          <Col>
            <input type="text" name="amount" onChange={onChangeData} />
          </Col>
          <Col>
            <input type="text" name="description" onChange={onChangeData} />
          </Col>
        </Row>
        <ButtonWrap>
          <Button type="button" className="submit" onClick={onClickSubmit}>
            저장
          </Button>
          <Button type="button" className="cancel" onClick={onClickCancel}>
            취소
          </Button>
        </ButtonWrap>
      </ModalStyle>
    </>
  );
}

export default AddModal;
