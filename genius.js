const api = require('genius-api');
const genius = new api(require('./keys').GENIUS_CLIENT_ACCESS_TOKEN);
const fs = require('fs'); // Used for testing output

// For every query a song ID is needed
exports.search = (title, artist, callback) => {
    let songList = [];
    let initiallyFound;
    if (typeof title === 'undefined') {
        // Neither passed
        if (typeof artist === 'undefined') callback([]);
        // Only Artist Name Passed
        else {
            genius.search(artist).then(artistResponse => {
                console.log('Found', artistResponse.hits.length, 'results from', artist, 'query');
                artistResponse.hits.forEach(item => {
                    songList.push({
                        id: item.result.id,
                        title: item.result.title_with_featured,
                        artist: item.result.primary_artist.name,
                        thumbnail: item.result.header_image_thumbnail_url,
                        url: item.result.url,
                        doubleMatch: false
                    });
                })
                callback(songList.splice(0, 3));
            })
        }
    }
    // Title is passed
    else {
        if (typeof artist === 'undefined') {
            // Only title is passed
            genius.search(title).then(titleResponse => {
                console.log('Found', titleResponse.hits.length, 'results from', title, 'query');
                titleResponse.hits.forEach(item => {
                    songList.push({
                        id: item.result.id,
                        title: item.result.title_with_featured,
                        artist: item.result.primary_artist.name,
                        thumbnail: item.result.header_image_thumbnail_url,
                        url: item.result.url,
                        doubleMatch: false
                    });
                })
                callback(songList.splice(0,3));
            })
        }
        else {
            // Search on title
            genius.search(title).then(titleResponse => {
                console.log('Found', titleResponse.hits.length, 'results from', title, 'query');
                //console.log(titleResponse.hits[0].result);
                // Add songs to list of potential songs
                titleResponse.hits.forEach(item => {
                    songList.push({
                        id: item.result.id,
                        title: item.result.title_with_featured,
                        artist: item.result.primary_artist.name,
                        thumbnail: item.result.header_image_thumbnail_url,
                        url: item.result.url,
                        doubleMatch: false
                    });
                })
                // Search on artist
                genius.search(artist).then(artistResponse => {
                    console.log('Found', artistResponse.hits.length, 'results from', artist, 'query');
                    // Check for results that match both queries as well as new results
                    artistResponse.hits.forEach(artistSong => {
                        initiallyFound = false;
                        // Both queries
                        for (const titleSong of songList) {
                            if (titleSong.id === artistSong.result.id) {
                                titleSong.doubleMatch = true;
                                initiallyFound = true;
                            }
                        }
                        // New results
                        if (!initiallyFound) {
                            songList.push({
                                id: artistSong.result.id,
                                title: artistSong.result.title_with_featured,
                                artist: artistSong.result.primary_artist.name,
                                thumbnail: artistSong.result.header_image_thumbnail_url,
                                url: artistSong.result.url,
                                doubleMatch: false
                            });
                        }
                    })
                    // Array of double matches
                    let doubleMatches = songList.filter(song => {
                        return song.doubleMatch;
                    });
                    if (doubleMatches.length < 2) {
                        // Return any double matches + regular matches up to 3 total
                        callback(doubleMatches.concat(songList.slice(0, 3 - doubleMatches.length)));     
                    }
                    else {
                        callback(doubleMatches.slice(0, 3));  // Return just double matches
                    }
                })  
            })
        }
    }
}
