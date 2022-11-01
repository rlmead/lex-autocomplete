import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import specialCharacters from "../data/special-characters";

class Ngram {
  constructor() {
    this.firebaseConfig = require('../data/firebaseconfig.json');
    this.app = initializeApp(this.firebaseConfig);
    this.db = getDatabase(this.app);
    this.wI = '<s>';
    this.wJ = '<s>';
    this.wK = '';
  }

  getWeightedRandom(probArray) {
    let randomFloat = Math.random();
    return probArray.findIndex( (prob) => prob >= randomFloat );
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  desanitize(word) {
    word = word.replace(/<dot>|<slash>|<dollar>|<hash>|<lbracket>|<rbracket>/gi, function (matched) {
      return specialCharacters[matched];
    });
    return word;
  }

  print(wordArr, leanArr) {
    var outputArray = [];
    var sentEnder = ["<dot>", "!", "?"];
    for (let i = 0; i < wordArr.length; i++) {
      let word = this.desanitize(wordArr[i]);
      let lean = leanArr[i];
      if (outputArray.length == 0) {
        word = this.capitalize(word);
        outputArray.push(word);
      } else {
        if (sentEnder.includes(wordArr[i - 1])) {
          word = this.capitalize(word);
        }
        if (lean == '<' || lean == '>' | leanArr[i - 1] == '>' || leanArr == '<>') {
          outputArray.push(word);
        } else {
          outputArray.push(" ", word);
        }
      }
    }
    return outputArray.join('');
  }

  async getTrigramData(wordI, wordJ, func) {
    const dbRef = ref(this.db);
    await get(child(dbRef, `trigrams/${wordI}/${wordJ}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          func(snapshot.val());
        }
      }).catch((error) => {
        console.error(error);
      });
  }

  async getNextWord(wordI, wordJ, func) {
    await this.getTrigramData(wordI, wordJ, (data) => {
      func(data);
    });
  }
}

export default Ngram;