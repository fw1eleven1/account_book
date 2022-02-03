import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import moment from "moment";
import { MdDelete } from "react-icons/md";
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

  & > div {
    padding: 5px 10px;
  }
`;

const ModalHeader = styled.div`
  font-size: 1.5em;
  border-bottom: 1px solid #e1e1e1;
`;

const ModalBody = styled.div`
  border-bottom: 1px solid #e1e1e1;
`;
const ModalFooter = styled.div`
  text-align: right;

  & > div {
    padding-right: 20px;
  }
`;

const DeleteIcon = styled.span`
  position: absolute;
  display: none;
  top: 4px;
  right: 0;
  width: 25px;
  height: 25px;
  color: #a1a1a1;
  cursor: pointer;
`;

const AccountList = styled.div`
  position: relative;

  :first-child {
    font-weight: 700;
  }

  & ~ &:hover {
    background-color: #e1e1e1;
    ${DeleteIcon} {
      display: initial;
    }
  }
`;

const AccountItem = styled.div`
  display: inline-block;
  width: calc(100% / 3);
  text-align: center;
  padding: 3px 0;
`;

function Modal({ modalDate }) {
  const [accountDetail, setAccountDetail] = useState([]);
  const dispatch = useAccountDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://193.122.105.156:5000/account/${modalDate}`
      );

      setAccountDetail(response.data);
    };

    fetchData();
  }, [modalDate]);

  const onClickDelete = useCallback(
    async (id) => {
      const response = await axios.delete(
        "http://193.122.105.156:5000/account",
        {
          data: {
            accountId: id,
          },
        }
      );

      if (response.data === "OK") {
        setAccountDetail(accountDetail.filter((account) => account.id !== id));

        const response = await axios.get(
          "http://193.122.105.156:5000/account",
          {
            params: { date: moment().format("YYYY-MM") },
          }
        );

        dispatch({ type: "SET", account: response.data });
      }
    },
    [dispatch, accountDetail]
  );

  return (
    <>
      <ModalStyle>
        <ModalHeader>{modalDate}</ModalHeader>
        {accountDetail.length === 0 ? (
          <div style={{ textAlign: "center" }}>내역 없음</div>
        ) : (
          <>
            <ModalBody>
              <AccountList>
                <AccountItem>입금</AccountItem>
                <AccountItem>지출</AccountItem>
                <AccountItem>내역</AccountItem>
              </AccountList>
              {accountDetail.map((n, i) => (
                <AccountList key={n.id}>
                  <AccountItem>{n.credit} 원</AccountItem>
                  <AccountItem>{n.debit} 원</AccountItem>
                  <AccountItem>{n.description}</AccountItem>
                  <DeleteIcon onClick={() => onClickDelete(n.id)}>
                    <MdDelete />
                  </DeleteIcon>
                </AccountList>
              ))}
            </ModalBody>
            <ModalFooter>
              <div>
                입금 합:
                {accountDetail.reduce((prev, curr) => prev + curr.credit, 0)}
              </div>
              <div>
                지출 합:
                {accountDetail.reduce((prev, curr) => prev + curr.debit, 0)}
              </div>
            </ModalFooter>
          </>
        )}
      </ModalStyle>
    </>
  );
}

export default Modal;
