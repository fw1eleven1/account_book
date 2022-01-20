import React from "react";
import styled from "styled-components";

const Row = styled.div`
  position: relative;
  padding-left: 25px;
  margin: 2px 0;
  font-size: 0.8em;
  text-align: right;

  .icon {
    margin-right: 5px;
  }
`;

function History({ credit, debit }) {
  return (
    <div>
      <Row>
        <span className="icon">+</span>
        <span>{credit} 원</span>
      </Row>
      <Row>
        <span className="icon">-</span>
        <span>{debit} 원</span>
      </Row>
    </div>
  );
}

export default History;
