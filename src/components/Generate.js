import React, { useState } from "react";
import { Container, Row, Col, Button, Card, CardTitle, CardBody, CardText } from "reactstrap";
import Ngram from "./Ngram";
import Spinners from "./Spinners";

function Generate() {
  const model = new Ngram;
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateComment() {
    setOutput('');
    setLoading(true);
    let commentArray = ['<s>', '<s>'];
    let leanArray = ['', ''];
    let finished = false;
    for (let i = 0; i < 100 && !finished; i++) {
      let wI = commentArray[commentArray.length - 2];
      let wJ = commentArray[commentArray.length - 1];
      await model.getNextWord(wI, wJ, (trigramData) => {
        let wordData = trigramData.next_word;
        let word;
        let leanData = trigramData.lean;
        let lean;
        if (typeof wordData == 'string') {
          word = wordData;
          lean = leanData;
        } else {
          let idx = model.getWeightedRandom(trigramData.sum_prob);
          word = wordData[idx];
          lean = leanData[idx];
        }
        if (model.desanitize(word) != '</s>') {
          commentArray.push(word);
          leanArray.push(lean);
        } else {
          finished = true;
        }
      });
    }
    if (!['...', '.', '?', '!', ',', ';', ':', '-'].includes(model.desanitize(commentArray[commentArray.length - 1]))) {
      commentArray.push('...');
      leanArray.push('<');
    }
    setLoading(false);
    setOutput(model.print(commentArray.slice(2), leanArray.slice(2)));
  }

  return (
    <Container>
      <Row className="mt-4 mb-5">
        <Col md={{ size: 2, offset: 1 }}>
          <div className="d-flex justify-content-center">
            <Button color="warning" className="shadow m-2" onClick={generateComment}>Generate</Button></div>
        </Col>
        <Col md={{ size: 8 }}>
          <Card className="shadow">
            <CardBody>
              {
                loading &&
                <Spinners className="" />
              }
              <CardText className="lead">{output}</CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Generate;