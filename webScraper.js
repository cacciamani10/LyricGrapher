const cheerio = require('cheerio');
const request = require('request');
const hashTable = require('./hashTable').hashTable;
// For testing
const fs = require('fs');

exports.getLyricsData = (uri, callback) => {
    request(uri, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            //fs.writeFileSync('lyricpage.html', html);
            const $ = cheerio.load(html);
            const lyrics = $('p').text();
            getWordData(lyrics);
            callback(lyrics);
        }
        else {
            console.log('Could not getLyrics', error);
        }
    })
}

const getWordData = text => {
    // Remove genius headings, punctuation, and then split into an array on whitespace
    let regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    text = text.replace(/\[.*?\]/g, '').replace(regex, '').toLowerCase().split(/[\s\n]/);
    hashTable(text, 4)
    // text.forEach(w => {
    //     Count word occurences using some kind of data structure. There could be over 1000 unique words.
    // })
    // Compile list of words into chart.js data object
    // See https://www.chartjs.org/docs/latest/getting-started/usage.html
}
