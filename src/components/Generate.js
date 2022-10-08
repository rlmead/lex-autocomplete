import React from "react";
import { Container, Row, Col } from "reactstrap";
import Model from "./Model";

function Generate() {
  return (
    <Container>
      <Row className="mt-4 mb-5">
        <Col md={{ size: 6, offset: 3 }}>
          <Model numWords={10}/>
        </Col>
      </Row>
    </Container>
  )
}

export default Generate;