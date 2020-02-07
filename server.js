const express = require('express');
const bodyParser = require('body-parser');
const search = require('./genius').search;
const getLyricsData = require('./webScraper').getLyricsData;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/search', (req, res) => {
    search(
        req.query.title, 
        req.query.artist, 
        data => res.json(data)
    );
})

app.get('/song', (req, res) => {
    getLyricsData(
        decodeURI(req.query.url), 
        lyrics => res.json(lyrics)
    );
})

app.listen(PORT);
