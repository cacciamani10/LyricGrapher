const express = require('express');
const api = require('genius-api');
const fs = require('fs'); // Used for testing output
const keys = require('./keys');
const ejs = require('ejs');

const app = express();
const PORT = process.env.PORT || 5000;
const genius = new api(keys.GENIUS_CLIENT_ACCESS_TOKEN);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/resources'));

const search = async (artist, title) => {
    genius.search().then(response => {
        console.log('Found', response.hits.length, 'results');
    })
}
app.get('/', (req, res) => {
    res.render('index', {});
});

app.get('/', (req, res) => {

})

app.listen(PORT);

