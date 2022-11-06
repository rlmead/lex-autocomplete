import React from "react";
import { Container, Row, Col } from "reactstrap";

function About() {
  return (
    <Container>
      <Row className="mt-4 mb-5">
        <Col md={{ size: 8, offset: 2 }}>
          <p>This project explores ideas of the residents of Lexington, Kentucky for their city's future through combinations of their own words.</p>
          <p>The words are selected by a <a href="https://en.wikipedia.org/wiki/Trigram" target="_blank">trigram model</a>. This model was trained on <a href="https://static1.squarespace.com/static/61819f627baf68009186fb50/t/62b236b49282122e7044db59/1655846584979/OTT+Posters+for+Website.pdf" target="_blank">a data set</a> that was gathered by <a href="https://www.civiclex.org/" target="_blank">Civic Lex</a> as part of their 2022 <a href="https://www.ottlex.org/" target="_blank">On The Table</a> program.</p>
          <p>This website was created by <a href="https://jofrhwld.github.io/" target="_blank">Joe</a> and <a href="https://also-and.web.app/" target="_blank">B</a>.</p>
        </Col>
      </Row>
    </Container>
  )
}

export default About;