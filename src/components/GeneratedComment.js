import Ngram from "./Ngram";

class GeneratedComment {
    constructor() {
        this.wI = '<s>';
        this.wJ = '<s>';
        this.commentArray = ['constructor'];
    }

    titleCase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    update(wK) {
        if (this.commentArray.length == 0) {
            this.commentArray.push(this.titleCase(wK));
        }
        return this.commentArray;
    }

    async generate() {
        const model = new Ngram;
        await model.getTrigramData(this.wI, this.wJ);
        this.commentArray.push('generate');
    }

    print() {
        return this.commentArray.join(' ');
    }

}

export default GeneratedComment;