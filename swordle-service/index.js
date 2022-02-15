const express = require('express');
const cors = require('cors');
const service = require('./service');

const server = express();
server.use(express.json());

const corsConfig = {
    origin: '*',
    optionsSuccessStatus: 200
}

server.get('/word', cors(corsConfig), async (req, res) => {
    const currentWord = await service.getCurrentWord();
    res.send(currentWord);
});

server.listen(3001, () => {
    console.log('Server started on port [3001]');
});