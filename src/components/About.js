import React from "react";
import { Container, Row, Col } from "reactstrap";

function About() {
  return (
    <Container>
      <Row className="mt-4 mb-5">
        <Col md={{ size: 8, offset:2}} style={{fontSize: "1.25em"}}>
          <h1>
            What is this?
          </h1>
          <p>
            Lexingtonians submitted over 10,000 comments about their ideas for Lexington's future as part of <a className="text-success" href="https://www.ottlex.org/" target="_blank">On The Table</a>. We wanted to build a tool that explored the sense of what everyone had to say! So we built a language model that cuts up and remixes all of the comments to generate new text.
          </p>

          <h2>
            Are these <em>actual</em> comments people left?
          </h2>
          <p>
            You are not very likely to see a whole comment that someone actually submitted, but it's not impossible. Actually, some of the generated comments might express the <em>opposite</em> sentiment of originals. Maybe someone didn't want to cut down all the trees in the city, and said so.
          </p>
          <blockquote>
            <span>original</span>
            <p>I don't <b>think we should cut down all the trees in the city.</b></p>
          </blockquote>
          <p>
            The model might remix the last part of the comment into something like this:
          </p>
          <blockquote>
            <span>remixed</span>
            <p>I <b>think we should cut down all the trees in the city.</b></p>
          </blockquote>

          <p>
            So always read generated comments with a grain of salt!
          </p>
          <h2>How does it work? Is this an AI? 🤖</h2>
          <p>
            This isn't an AI. It's a model built on the idea that the next word you see in a sentence is predictable given the words that came before. You can probably guess a few words that are likely to fill in the blank here:
          </p>
          <ul>
            <li>She went to the baker to get a loaf of ___</li>
          </ul>
          <p>
            The words "baker" and "loaf of" make it more likely that the missing word is "bread" or "sourdough" than "cabbage" or "oranges".
          </p>
          <p>
            To build the autocomplete model, we split every comment up into its individual words, then counted up how often every word appeared after the two words that came before it. For example, here's how often the following words appeared after "I want":
          </p>
          
          <Row className="mt-1 mb-3">
            <Col md={{ size: 2, offset:2}}>
              <p>"I want..."</p>
            </Col>
            <Col md={{ size: 4, offset:0}}>
            <table>
              <thead>
                <tr>
                  <th>next</th>
                  <th>frequency</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                 <td>to</td>
                 <td class="text-end">12</td>
                </tr>
                <tr>
                  <td>all</td>
                 <td class="text-end">2</td>
                </tr>
                <tr>
                 <td>the</td>
                 <td class="text-end">2</td>
                </tr>
                <tr>
                 <td>a</td>
                 <td class="text-end">1</td>
                </tr>
                <tr>
                 <td>everybody</td>
                 <td class="text-end">1</td>
                </tr>
                <tr>
                 <td>everyone</td>
                 <td class="text-end">1</td>
                </tr>
                <tr>
                 <td>Lexington</td>
                 <td class="text-end">1</td>
                </tr>
                <tr>
                 <td>more</td>
                 <td class="text-end">1</td>
                </tr>
                <tr>
                 <td>my</td>
                 <td class="text-end">1</td>
                </tr>
                <tr>
                 <td>or</td>
                 <td class="text-end">1</td>
                </tr>
                <tr>
                 <td>police</td>
                 <td class="text-end">1</td>
                </tr>
                <tr>
                 <td>us</td>
                 <td class="text-end">1</td>
                </tr>
                <tr>
                 <td>you</td>
                 <td class="text-end">1</td>
                </tr>
              </tbody>
            </table>
            </Col>
          </Row>

        <p>The comment generator and autocomplete tools pick the next word based on these frequencies, meaning they're more likely to pick a word that appeared more often than a word that appeared less often. If this time it picked "all", the process starts all over again with "want all":</p>
          <Row className="mt-1 mb-3">
            <Col md={{ size: 2, offset:2}}>
              <p>"want all..."</p>
            </Col>
            <Col md={{ size: 4, offset:0}}>
            <table>
              <thead>
                <tr>
                  <th>next &nbsp;&nbsp;</th>
                  <th>frequency</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                 <td>of</td>
                 <td class="text-end">2</td>
                </tr>
                <tr>
                  <td>the</td>
                 <td class="text-end">1</td>
                </tr>
              </tbody>
            </table>
            </Col>
          </Row>
          <p>
            It's kind of surprising a simple process of picking words like this will generate readable sentences, and it's also why the generated comments sometimes seem like they "lose their train of thought" part way through. They can only remember the previous two words that got generated!
          </p>
          <hr></hr>
          <h2>Technical Details</h2>
          <p>
            The trigram model was built in R. Qualitative comments were tokenized and named entitites identified via the <a className="text-success" href="https://cran.r-project.org/web/packages/spacyr/" target="_blank">spacyR package</a>, using the <a className="text-success" href="https://spacy.io/models/en#en_core_web_trf" target="_blank">en_core_web_trf model</a>. Some light by-hand text normalization was done to, e.g. expand abbreviations for "St." and "Rd." to "Street" and "Road", as well as trying to normalize all spelling variants of "Lextran". Identified named entities were title cased, the pronoun "I" was upper-cased, and all other tokens lower-cased. A number of punctuation and contraction tokens had their left or right "lean" hand coded for detokenization. The resulting model was written to JSON for processing by the Javascript comment generators.
          </p>
          <p>
            The site is built in React and hosted on Firebase. Actual token selection is done via calls to the Firebase Realtime Database, and detokenization into the final printed comments is implemented in Javascript. 
          </p>
          <p>
            All of the code for generating the model and building the website can be found <a className="text-success" href="https://github.com/rlmead/ott-prediction" target="_blank">on github</a>.
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default About;