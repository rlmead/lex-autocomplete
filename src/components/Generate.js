import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import GeneratedComment from "./GeneratedComment";

function Generate() {
  const comment = new GeneratedComment;

  const [output, setOutput] = useState(comment.print());

  useEffect(() => {
    comment.generate();
    setOutput(comment.print());
  }, [comment])

  return (
    <Container>
      <Row className="mt-4 mb-5">
        <Col md={{ size: 6, offset: 3 }}>
          <h3>generate</h3>
          <p> { output } </p>
        </Col>
      </Row>
    </Container>
  )
}

export default Generate;