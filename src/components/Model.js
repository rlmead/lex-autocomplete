import { useEffect, useState } from 'react';
import script from '../python/ngram-model.py';

const Model = () => {
  const [output, setOutput] = useState('');

  const runScript = code => {
    window.pyodide.loadPackage([]).then(() => {
      const output = window.pyodide.runPython(code);
      setOutput(output);
    })
  }

  useEffect(() => {
    window.languagePluginLoader.then(() => {
      fetch(script)
        .then(src => src.text())
        .then(runScript)
    })
  })

  return (
    <p>{output}</p>
  );
}

export default Model;