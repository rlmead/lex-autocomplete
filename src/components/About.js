import React from "react";
import { Container, Row, Col } from "reactstrap";

function About() {
  return (
    <Container>
      <Row className="mt-4 mb-5">
        <Col md={{ size: 8, offset: 2 }}>
          <p>This project explores ideas of the residents of Lexington, Kentucky for their city's future through combinations of their own words.</p>
          <p>The words in these automatically-generated comments are selected by a <a className="text-success" href="https://en.wikipedia.org/wiki/Trigram" target="_blank">trigram model</a>. This model was trained on <a className="text-success" href="https://static1.squarespace.com/static/61819f627baf68009186fb50/t/62b236b49282122e7044db59/1655846584979/OTT+Posters+for+Website.pdf" target="_blank">a data set</a> that was gathered by <a className="text-success" href="https://www.civiclex.org/" target="_blank">Civic Lex</a> as part of their 2022 <a className="text-success" href="https://www.ottlex.org/" target="_blank">On The Table</a> program.</p>
          <p>Output from trigram models doesn't always make sense, but it gives you a glimpse into the data it's trained on.</p>
        </Col>
      </Row>
    </Container>
  )
}

export default About;