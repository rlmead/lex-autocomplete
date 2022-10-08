import { useEffect, useState } from 'react';
import getWord from '../python/ngram-model.py';

function Model(props) {
  const numWords = props['numWords'];
  const [output, setOutput] = useState('');

  const runScript = inputArray => {
    var [code, numWords] = inputArray
    window.pyodide.loadPackage([]).then(() => {
      const output = window.pyodide.runPython(code + 'getWord(' + numWords + ')');
      setOutput(output);
    })
  }

  useEffect(() => {
    window.languagePluginLoader.then(() => {
      fetch(getWord)
        .then(script => script.text())
        .then(code => [code, numWords])
        .then(runScript)
    })
  })

  return (
    <p>{output}</p>
  );
}

export default Model;