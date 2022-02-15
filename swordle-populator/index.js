const fs = require('fs');

const WORD_LIST_FILE = 'swe_wordlist';

const retrieveWords = _ => {
    let words = [];
    try {
        words = fs
            .readFileSync(WORD_LIST_FILE, 'utf-8')
            .split('\r\n')
            .filter(isValidWord);
    } catch(e) {
        console.error(e);
    }

    return words;
}

const shuffleWords = (words) => {
    for(let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
}

const isValidWord = word => {
    if(word.trim().length != 5) {
        return false;
    }

    return /[a-zA-ZöäåÖÄÅ]{5}/.test(word)
}

const words = retrieveWords();
shuffleWords(words);
fs.writeFileSync('../swordle-app/src/word-list.json', JSON.stringify(words));