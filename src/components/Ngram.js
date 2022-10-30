import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, get, child } from "firebase/database";

class Ngram {
    constructor() {
        this.firebaseConfig = require('../firebaseconfig.json');
        this.app = initializeApp(this.firebaseConfig);
        this.db = getDatabase(this.app);
        this.wI = '<s>';
        this.wJ = '<s>';
        this.wK = '';
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

    titleCase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

}

export default Ngram;