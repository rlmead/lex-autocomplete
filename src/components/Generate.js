import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, CardBody, CardText, Tooltip } from "reactstrap";
import Ngram from "./Ngram";
import Spinners from "./Spinners";

function Generate() {
  const model = new Ngram;
  const [output, setOutput] = useState('');
  const [storedOutput, setStoredOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    const storedComment = JSON.parse(window.localStorage.getItem('generateOutput'));
    if (storedComment) {
      setStoredOutput(storedComment);
    }
  }, [])

  useEffect(() => {
    setOutput(storedOutput);
  }, [storedOutput])

  useEffect(() => {
    window.localStorage.setItem('generateOutput',JSON.stringify(output));
  }, [output])

  function toggle() {
    setTooltipOpen(!tooltipOpen)
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(output);
  }

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
      if (i == 99 && !['...', '.', '?', '!', ',', ';', ':', '-'].includes(model.desanitize(commentArray[commentArray.length - 1]))) {
        commentArray.push('...');
        leanArray.push('<');
      }
    }
    setLoading(false);
    setOutput(model.print(commentArray.slice(2), leanArray.slice(2)));
  }

  return (
    <Container>
      <Row className="mt-3">
        <Col md={{ size: 8, offset: 2 }}>
          <div className="d-flex justify-content-center">
            <Button color="warning" className="shadow mb-3" onClick={generateComment}>Generate a comment</Button></div>
          <Card className="shadow p-3 mb-5">
            <CardBody>
              {
                loading ? <Spinners />
                  : <CardText className="lead">
                    {output}
                  </CardText>
              }
              {
                output &&
                <div className="d-flex flex-row-reverse">
                  <FontAwesomeIcon icon={faCopy} style={{ cursor: "pointer" }} onClick={copyToClipboard} id="copyIcon" />
                  <Tooltip placement="right" isOpen={tooltipOpen} target="copyIcon" toggle={toggle}>
                    click to copy
                  </Tooltip>
                </div>
              }
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Generate;