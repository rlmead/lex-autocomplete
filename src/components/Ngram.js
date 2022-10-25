import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";

class Ngram {
    constructor() {
        this.firebaseConfig = require('../firebaseconfig.json');
        this.app = initializeApp(this.firebaseConfig);
        this.db = getDatabase(this.app);
    }
    
    async getTrigramData(wordI, wordJ) {
        const trigrams = ref(this.db, 'trigrams/' + wordI + '/' + wordJ);
        onValue(trigrams, (snapshot) => {
            console.log(snapshot.val());
            return snapshot.val();
        });
    }

    async chooseNextWord(wordI, wordJ) {
        const data = await this.getTrigramData(wordI, wordJ);
        return data;
    }
}

export default Ngram;