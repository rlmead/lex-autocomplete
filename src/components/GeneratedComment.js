import Ngram from "./Ngram";

class GeneratedComment {
    constructor() {
        this.wI = '<s>';
        this.wJ = '<s>';
        this.wK = '';
        this.commentArray = ['constructor'];
        this.model = new Ngram;
    }

    titleCase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    append(wK) {
        if (this.commentArray.length == 0) {
            this.commentArray.push(this.titleCase(wK));
        } else {
            this.commentArray.push(wK);
        }
    }

    generate() {
        this.model.getNextWord(this.wI, this.wJ, (word) => {
            this.append(word);
        });
    }

    print() {
        return this.commentArray.join(' ');
    }

}

export default GeneratedComment;