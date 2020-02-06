const fs = require('fs');

const hashString = (word, max) => {
    const c = 34;
    let hash = 0;
    for (letter of word) {
        hash = c * hash + letter.charCodeAt(0);
    }
    return hash % max + 1;
}

exports.hashTable = (lyricsArr, maxBucket) => {
    let table = [];
    let collisionCount = 0;
    for (word of lyricsArr) {
        let hash = hashString(word, 1000);
        // Location Empty (new word)
        if (typeof table[hash] === 'undefined') {
            table[hash] = [{
                word: word,
                count: 1
            }]
        }
        // Location occupied
        else  {
            let found = false;
            
            // Iterate through buckets
            for (wordObj of table[hash]) {
                if (wordObj.word === word) {
                    wordObj.count++;
                    found = true;
                    break;
                }
            }
            if (!found) {
                collisionCount++;
                if (table[hash].length <= maxBucket) {
                    table[hash].push({
                        word: word,
                        count: 1
                    })
                }
                else {
                    throw `Bucket limit exceeded at ${hash}! ${word} not added`;
                }
            }
        }
    }
    console.log('Final size of array:', table.length);
    console.log('Final collision count:', collisionCount);
    table = table.filter(e => e);
    
    return table;
}

