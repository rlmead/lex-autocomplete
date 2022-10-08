import React from "react";
import { Container, Row, Col } from "reactstrap";
import Model from "./Model";

function Autocomplete() {
  return (
    <Container>
      <Row className="mt-4 mb-5">
        <Col md={{ size: 6, offset: 3 }}>
          <Model numWords={3} />
        </Col>
      </Row>
    </Container>
  )
}

export default Autocomplete;