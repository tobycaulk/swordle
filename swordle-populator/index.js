const fs = require('fs');
const { MongoClient } = require('mongodb');

const WORD_LIST_FILE = 'swe_wordlist';

const client = new MongoClient('mongodb://127.0.0.1:27017');

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

(async () => {
    /*await client.connect();
    console.log('Connected to Mongo');
    await storeWords(client, retrieveWords());
    client.close();*/
})();

const storeWords = async (client, words) => {
    const db = client.db('swordle');
    const wordsCollection = db.collection('words');
    const documents = words.map(word => ({ word }));
    shuffleWords(documents);
    addDatesToWords(documents);
    const insertResult = await wordsCollection.insertMany(documents);
    console.log(`insert words result: ${JSON.stringify(insertResult)}`);
}

const shuffleWords = (words) => {
    for(let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
}

const addDatesToWords = (words) => {
    words.forEach((word, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        word.date = new Date(date.toDateString());
    });
}

const isValidWord = word => {
    if(word.trim().length != 5) {
        return false;
    }

    return /[a-zA-ZöäåÖÄÅ]{5}/.test(word)
}

const words = retrieveWords();
fs.writeFileSync('word-list.json', JSON.stringify(words));