const cheerio = require('cheerio');
const request = require('request');
const hashTable = require('./hashTable').hashTable;
// For testing
const fs = require('fs');

exports.getLyricsData = (uri, callback) => {
    request(uri, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            let lyrics = $('.lyrics').css({ 'font-size': '1.125em'}).text();
            lyrics = getWordData(lyrics);
            callback(lyrics);
        }
        else {
            console.log('Could not getLyrics', error);
        }
    })
}

const getWordData = text => {
    // Remove genius headings, punctuation, and then split into an array on whitespace
    let regex = /[!"#$%&'()*+,./:;<=>?@[\]^_`{|}~]/g;
    text = text.replace(/\[.*?\]/g, '').replace(regex, '').replace(/[\n\t-/]/g, ' ').toLowerCase();
    let lyricArr = text.split(/[ ]+/); // Split on space 
    lyricArr.pop(); // Remove last empty element
    lyricArr.shift(); // Remove 1st empty element
    
    const results = hashTable(lyricArr, 4);
    // Get rid of collisions for easy sorting
    let collisionWords = [];
    results.forEach(bucket => {
        while (bucket.length > 1) {
            collisionWords.push(bucket.pop());
        }
    });
    collisionWords.forEach(word => {
        results.push([collisionWords.pop()])
    });

    results.sort((a, b) => {
        if (a[0].word > b[0].word) {
            return 1;
        }
        if (a[0].word < b[0].word) {
            return -1;
        }
        return 0;
    })
    //fs.writeFileSync('wordCount.json', JSON.stringify(results));

    // Compile list of words into chart.js data object
    let labels = [];
    let counts = [];
    results.forEach(word => {
        labels.push(word[0].word);
        counts.push(word[0].count);
    })
    return {
        labels: labels,
        datasets: [{
            label: '# of Votes',
            data: counts,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    }
    // See https://www.chartjs.org/docs/latest/getting-started/usage.html
}
