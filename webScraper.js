const cheerio = require('cheerio');
const request = require('request');
// For testing
const fs = require('fs');

exports.getLyricsData = uri => {
    request(uri, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            //fs.writeFileSync('lyricpage.html', html);
            const $ = cheerio.load(html);
            const lyrics = $('p').text();
            let data = {

            }
        }
        else {
            console.log('Could not getLyrics', error);
        }
    })
}

const getWordData = text => {
    // Remove genius headings, punctuation, and then split into an array on whitespace
    text = text.replace(/\[.*?\]/g, '').replace(/[,\!\.\"\']/g, '').split(/\s\n/);
    text.forEach(w => {
        // Count word occurences using some kind of data structure. There could be over 1000 unique words.
    })
    // Compile list of words into chart.js data object
    // See https://www.chartjs.org/docs/latest/getting-started/usage.html
}
