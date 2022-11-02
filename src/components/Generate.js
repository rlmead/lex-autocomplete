import React, { useState } from "react";
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