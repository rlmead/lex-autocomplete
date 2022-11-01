const firebaseConfig = require('./data/firebaseconfig.js');
const trigramData = require('../data/model.json');

import('firebase/app')
  .then((firebase) => {
    const app = firebase.initializeApp(firebaseConfig);
    import('firebase/database')
      .then((database) => {
        console.log('Uploading data to ' + firebaseConfig.projectId);
        const db = database.getDatabase(app);
        function writeTrigramData(data) {
          const reference = database.ref(db, 'trigrams');
          database.set(reference, data);
        };
        writeTrigramData(trigramData);
        console.log('Data has finished uploading!');
      })
      .catch((err) => {
        console.log(err.message);
      });
  })
  .catch((err) => {
    console.log(err.message);
  });
