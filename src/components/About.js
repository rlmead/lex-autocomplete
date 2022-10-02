import React from "react";
import { Container, Row, Col } from "reactstrap";

function About() {
  return (
    <Container>
      <Row className="mt-4 mb-5">
        <Col md={{ size: 6, offset: 3 }}>
          <h3>info</h3>
          <p>stuff goes here</p>
        </Col>
      </Row>
    </Container>
  )
}

export default About;