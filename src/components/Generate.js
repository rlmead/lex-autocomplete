import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Ngram from "./Ngram";
import Spinners from "./Spinners";

function Generate() {
  const model = new Ngram;
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateComment() {
    setOutput('');
    setLoading(true);
    var commentArray = ['<s>', '<s>'];
    for (let i = 0; i < 20; i++) {
      let wI = commentArray[commentArray.length - 2];
      let wJ = commentArray[commentArray.length - 1];
      await model.getNextWord(wI, wJ, (word) => {
        if (typeof word == 'string') {
          commentArray.push(word);
        } else {
          let nextWord = word[Math.floor(Math.random()*word.length)];
          commentArray.push(nextWord);
        }
      });
    }
    setLoading(false);
    setOutput(model.print(commentArray.slice(2)));
  }

  return (
    <Container>
      <Row className="mt-4 mb-5">
        <Col md={{ size: 6, offset: 3 }}>
          <Button color="warning" className="shadow" onClick={generateComment}>Generate</Button>
          {
            loading &&
            <Spinners />
          }
          <p> {output} </p>
        </Col>
      </Row>
    </Container>
  )
}

export default Generate;