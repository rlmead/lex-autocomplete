import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, CardBody, CardText } from "reactstrap";
import Ngram from "./Ngram";
import Spinners from "./Spinners";

function Autocomplete() {
  const model = new Ngram();
  const [output, setOutput] = useState('');
  const [writing, setWriting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentArray, setCommentArray] = useState(['<s>', '<s>']);
  const [leanArray, setLeanArray] = useState(['', '']);
  const [wordChoiceArray, setWordChoiceArray] = useState([]);
  const [leanChoiceArray, setLeanChoiceArray] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedCommentArray = JSON.parse(window.localStorage.getItem('autocompleteCommentArray'));
    const storedLeanArray = JSON.parse(window.localStorage.getItem('autocompleteLeanArray'));
    if (storedCommentArray && storedLeanArray) {
      setCommentArray(storedCommentArray);
      setLeanArray(storedLeanArray);
    }
    setOutput(model.print(commentArray.slice(2), leanArray.slice(2)));
  }, [])

  useEffect(() => {
    window.localStorage.setItem('autocompleteCommentArray', JSON.stringify(commentArray));
  }, [commentArray])

  useEffect(() => {
    window.localStorage.setItem('autocompleteLeanArray', JSON.stringify(leanArray));
  }, [leanArray])

  useEffect(() => {
    setLoading(false);
    if (commentArray[commentArray.length - 1] === '<<slash>s>') {
      setWriting(false);
    }
    if ([commentArray !== '<s>', '<s>']) {
      setOutput(model.print(commentArray.slice(2), leanArray.slice(2)))
    }
    if (writing) {
      let wI = commentArray[commentArray.length - 2];
      let wJ = commentArray[commentArray.length - 1];
      model.getNextWord(wI, wJ, (data) => {
        let wordData = data.next_word;
        let leanData = data.lean;
        let sumProb = data.sum_prob;
        let condProb = data.cond_prob;
        if (typeof wordData == 'string') {
          setWordChoiceArray([wordData]);
          setLeanChoiceArray([leanData]);
        } else {
          let indices = model.getWeightedRandoms(sumProb, condProb, 3);
          setWordChoiceArray(indices.map(i => wordData[i]));
          setLeanChoiceArray(indices.map(i => leanData[i]));
        }
      }
      )
    }
  }, [commentArray, writing])

  useEffect(() => {
    if (!writing) {
      setWordChoiceArray([]);
    }
  }, [writing])

  useEffect(() => {
    if (copied) {
      setTimeout(() => { setCopied(false) }, 1500);
    }
  }, [copied])

  function copyToClipboard() {
    navigator.clipboard.writeText(output);
    setCopied(true);
  }

  async function startComment() {
    setWordChoiceArray([]);
    setCommentArray(['<s>', '<s>']);
    setLeanArray(['', '']);
    setOutput('');
    setWriting(true);
    await addWord(false);
  }

  function addWord(event) {
    setLoading(true);
    if (event) {
      let index = event.target.id;
      setCommentArray(commentArray => [...commentArray, wordChoiceArray[index]]);
      setLeanArray(leanArray => [...leanArray, leanChoiceArray[index]]);
    };
  }

  return (
    <Container>

      <Row className="mt-3">
        <Col md={{ size: 8, offset: 2 }}>
          <div className="d-flex justify-content-center">
            <Button
              color={writing ? "secondary" : "warning"}
              className="shadow mb-3"
              onClick={startComment}>
              Start {writing ? "over" : "a new comment"}
            </Button></div>
        </Col>
      </Row>
      <Row>
        <Col md={{ size: 8, offset: 2 }}>
          <Card className={"shadow p-3" + (writing || " mb-5")}>
            <CardBody>
              <CardText className="lead">
                {output}
              </CardText>
              {
                output &&
                <div className="d-flex flex-row-reverse">
                  <FontAwesomeIcon
                    icon={copied ? faCheck : faCopy}
                    className={copied ? "text-success" : "text-dark"}
                    style={{ cursor: "pointer", outline: "none" }}
                    onClick={copyToClipboard}
                    id="copyIcon" />
                </div>
              }
            </CardBody>
          </Card>
          {
            loading
              ? <div className="mt-4"><Spinners /></div>
              : <div className="d-flex justify-content-center">
                {
                  writing && wordChoiceArray.map((item, index) => {
                    return (
                      <Button
                        key={index}
                        color="warning"
                        className="shadow m-3"
                        id={index}
                        onClick={addWord}>
                        {item === '<<slash>s>' ? '<End comment>' : model.desanitize(item)}
                      </Button>
                    )
                  })
                }
              </div>
          }
        </Col>
      </Row>
      <Row className="mb-5 p-2"></Row>
    </Container >
  )
}

export default Autocomplete;