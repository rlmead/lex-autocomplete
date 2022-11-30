import specialCharacters from "../data/special-characters";
import firebaseConfig from "../data/firebaseconfig";
import { getDatabase, ref, get, child } from "firebase/database";
const { initializeApp } = require("firebase/app");
const { initializeAppCheck, ReCaptchaV3Provider } = require("firebase/app-check");

const app = initializeApp(firebaseConfig);

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(firebaseConfig.reCaptchaKey),
  isTokenAutoRefreshEnabled: true
});
class Ngram {
  constructor() {
    this.db = getDatabase(app);
  }

  cumulativeSum(arr) {
    let output = arr.length > 0 ? [arr[0]] : [];
    for (let i = 1; i < arr.length; i++) {
      output.push(arr[i] + output[i - 1]);
    }
    return output;
  }

  getWeightedRandom(probArray) {
    let randomFloat = Math.random();
    return probArray.findIndex((prob) => prob >= randomFloat);
  }

  getWeightedRandoms(sumProb, condProb, num) {
    let allIndices = [...Array(sumProb.length).keys()];
    let chosenIndices = [];
    while (chosenIndices.length < num && allIndices.length > 0) {
      let index = this.getWeightedRandom(sumProb);
      chosenIndices.push(allIndices[index]);
      allIndices.splice(index, 1);
      condProb.splice(index, 1);
      sumProb = this.cumulativeSum(condProb);
      const newSum = condProb.reduce((partialSum, a) => partialSum + a, 0);
      sumProb = sumProb.map(p => p / newSum);
    }
    return chosenIndices;
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
      if (word != '</s>') {
        let lean = leanArr[i];
        if (outputArray.length == 0) {
          word = this.capitalize(word);
          outputArray.push(word);
        } else {
          if (sentEnder.includes(wordArr[i - 1])) {
            word = this.capitalize(word);
          }
          if (lean == '<' || leanArr[i - 1] == '>' || leanArr == '<>') {
            outputArray.push(word);
          } else {
            outputArray.push(" ", word);
          }
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