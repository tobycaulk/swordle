const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://127.0.0.1:27017');

let currentWord;

const getCurrentWord = async () => {
    if(currentWord && isValidWord(currentWord.word) && isValidWordDate(currentWord.date)) {
        console.log('returning current word from cache');
        return currentWord;
    } else {
        currentWord = null;
    }

    await client.connect();
    const db = client.db('swordle');
    const wordsCollection = db.collection('words');

    let lessThanDate = new Date();
    lessThanDate.setDate(lessThanDate.getDate() + 1);
    lessThanDate = new Date(lessThanDate.toDateString());

    let greaterThanDate = new Date();
    greaterThanDate = new Date(greaterThanDate.toDateString());

    const result = await wordsCollection.findOne({ date: { $gte: greaterThanDate, $lt: lessThanDate } });

    if(isValidWord(result.word)) {
        currentWord = result;
    }

    return result;
}

const isValidWordDate = date => {
    if(!date) {
        return false;
    }

    return date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
}

const isValidWord = word => {
    if(!word || word.trim().length != 5) {
        return false;
    }

    return /[a-zA-ZöäåÖÄÅ]{5}/.test(word)
}

exports.getCurrentWord = getCurrentWord;