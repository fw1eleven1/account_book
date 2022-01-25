import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

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

const AccountHeader = styled.div`
  font-weight: 700;
`;
const AccountList = styled.div``;
const AccountItem = styled.div`
  display: inline-block;
  width: calc(100% / 3);
  text-align: center;
  padding: 3px 0;
`;

function Modal({ modalDate }) {
  const [accountDetail, setAccountDetail] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:5000/account/${modalDate}`
      );

      setAccountDetail(response.data);
    };

    fetchData();
  }, [modalDate]);

  return (
    <>
      <ModalStyle>
        <ModalHeader>{modalDate}</ModalHeader>
        {accountDetail.length === 0 ? (
          <div style={{ textAlign: "center" }}>내역 없음</div>
        ) : (
          <>
            <ModalBody>
              <AccountHeader>
                <AccountItem>입금</AccountItem>
                <AccountItem>지출</AccountItem>
                <AccountItem>내역</AccountItem>
              </AccountHeader>
              {accountDetail.map((n, i) => (
                <AccountList>
                  <AccountItem>{n.credit} 원</AccountItem>
                  <AccountItem>{n.debit} 원</AccountItem>
                  <AccountItem>{n.description}</AccountItem>
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
