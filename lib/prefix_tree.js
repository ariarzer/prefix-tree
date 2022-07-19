const correctingLayout = require("./correcting_layout.js");
const transliterate = require("./transliterate.js");
const unique = require("./unique.js");

module.exports = class PrefixTree {
    constructor(wordList = {}, treeRoot = { data: '' }) {
        this.wordsIdList = Object.keys(wordList);
        this.tree = treeRoot;

        Object.keys(wordList).forEach((wordId) => {
            wordList[wordId].forEach((prase) => {
                // просто слово
                if (prase.indexOf(' ') < 0) {
                    this.addWord(prase, wordId);
                } else { // несколько слов
                    prase.split(' ').forEach((word) => {
                        this.addWord(word, wordId);
                    });
                    this.addWord(prase, wordId);
                }
            });
        });
    }

    addWord(word, wordId = word) {
        let curNode = this.tree;
        const letters = word.toLowerCase().split('');
        letters.forEach((symbol, index, all) => {
            if (curNode[symbol] === undefined) {
                curNode[symbol] = { data: symbol };
            }
            if (index === all.length - 1) {
                if (curNode[symbol].id) {
                    curNode[symbol].id.push(wordId);
                } else {
                    curNode[symbol].id = [wordId];
                }
            }
            curNode = curNode[symbol];
        });
    }

    find(praseCase) {
        if (praseCase.length === 0) {
            return this.wordsIdList;
        }

        const prase = praseCase.toLowerCase();
        return unique([
            ...this.findPhrase(prase),
            ...this.findPhrase(correctingLayout(prase)),
            ...this.findPhrase(transliterate(prase)),
            ...this.findPhrase(transliterate(prase, true)),
            ...this.findPhrase(transliterate(correctingLayout(prase))),
            ...this.findPhrase(transliterate(correctingLayout(prase), true)),
        ]);
    }

    findPhrase(phraseCase) {
        const phrase = phraseCase.toLowerCase();

        if (phrase.split(' ').length === 1) {
            try {
                return this.findWord(phrase);
            } catch (e) {
                if (e.message === 'not found') {
                    return [];
                }
            }
        }

        let finds;
        try {
            finds = phrase.split(' ').map((item) => this.findWord(item));
        } catch (e) {
            if (e.message === 'not found') {
                return [];
            }
        }

        const result = [];

        finds.forEach((item, index, all) => {
            item.forEach((key) => {
                if (all[index + 1] && all[index + 1].includes(key)) {
                    result.push(key);
                }
            });
        });

        return this.unique(result);
    }

    findWord(word) {
        let result = [];

        const letters = word.split('');

        let curNode = this.tree;

        letters.forEach((symbol, index, all) => {
            if (curNode[symbol] === undefined) {
                throw new Error('not found');
            }

            if (index === all.length - 1) {
                result = this.getNodeIds(curNode[symbol]);
            }

            curNode = curNode[symbol];
            return 0;
        });

        return unique(result);
    }

    getNodeIds(node, result = []) {
        if (node.id) {
            node.id.forEach((item) => result.push(item));
        }

        Object.keys(node).forEach((key) => {
            if (key !== 'data' && key !== 'id') {
                this.getNodeIds(node[key], result);
            }
        });

        return result;
    }
}
