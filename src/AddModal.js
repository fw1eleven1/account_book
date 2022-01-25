import React, { useCallback } from "react";
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

function AddModal(params) {
  const onClickSubmit = useCallback(() => {}, []);
  const onClickCancel = useCallback(() => {}, []);

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
            <input type="text" />
          </Col>
          <Col>
            <select>
              <option value="credit">입금</option>
              <option value="debit">지출</option>
            </select>
          </Col>
          <Col>
            <input type="text" />
          </Col>
          <Col>
            <input type="text" />
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
