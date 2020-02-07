// const validate = () => {
//     const artist = document.getElementById('artist').innerHTML;
//     const title = document.getElementById('title').innerHTML;
//     let ctx1 = document.getElementById('chart1').getContext('2d');
//     let ctx2 = document.getElementById('chart2').getContext('2d');
// }
let lyricsChart = null;
const addSong = (url, thumbnail) => {
    fetch(`/song?url=${encodeURIComponent(url)}`, 
    {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            if (response.status !== 200) {
                console.log('Error fetching: code', response.status);
                return;
            }
            response.json().then(jsrp => {
                console.log(jsrp);
                if (lyricsChart !== null) {
                    lyricsChart.destroy();
                }
                let chartContainer = document.getElementById('chart-container');
                chartContainer.style.height = '90vh';
                chartContainer.style.width = '90vw';
                const ctx = document.getElementById('chart1').getContext('2d');
                let img = new Image()
                img.src = thumbnail;
                img.onload = () => {
                    jsrp.datasets[0].backgroundColor = ctx.createPattern(img, 'repeat');
                    lyricsChart = new Chart(ctx, {
                        type: 'bar',
                        data: jsrp,
                        options: {}
                    });
                }
            })
        })
        .catch(err => console.log(err));    
}

const getThumbLink = uri => {
    return JSON.stringify(uri);
}

const search = (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    // Determine Which Input Fields Were Entered
    let uri = '/search?';

    if (title !== '') {
        
        if (artist !== '') {
            uri += `title=${title}&artist=${artist}`;
        }
        else {
            uri += `title=${title}`;
        }
    }
    else {
        if (artist !== '') {
            uri += `artist=${artist}`;
        }
        else {
            alert('Please enter in at least one field');
            return;
        }
    }

    fetch(uri)
        .then(jsnr => {
            if (jsnr.status != 200) {
                console.log('Response Code:', jsnr.status);
                return;
            }
            jsnr.json()
            .then(searchResults => {
                let ul = document.getElementById('search-results');
                let html = "";
                searchResults.forEach(item => {
                    html += 
                    `<div class="search-result-item">
                        <img src="${item.thumbnail}" height="175" width="175" alt="Album thumbnail for ${item.artist}">
                        <div class="title-artist">
                            <li class="search-result-title">${item.title}</li> 
                            <li class="search-result-artist">${item.artist}</li>
                        </div>
                        <button class="add-button" onclick="addSong('${item.url}', '${item.thumbnail}')">+</button>
                    </div>`
                })
                ul.innerHTML = html;
            })
        }).catch(err => console.log(err));
}
