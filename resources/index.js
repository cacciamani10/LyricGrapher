// const validate = () => {
//     const artist = document.getElementById('artist').innerHTML;
//     const title = document.getElementById('title').innerHTML;
//     let ctx1 = document.getElementById('chart1').getContext('2d');
//     let ctx2 = document.getElementById('chart2').getContext('2d');
// }

const addSong = url => {
    fetch(`/song?url=${encodeURIComponent(url)}`)
        .then(jsnr => console.log(JSON.stringify(jsnr)))
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
                let ul = document.getElementById('search-results').innerHTML = "";
                
                searchResults.forEach(item => {
                    ul += 
                    `<div class="search-item">
                        <img src="${item.thumbnail}" height="175" width="175" alt="Album thumbnail for ${item.artist}">
                        <div class="title-artist">
                            <li>${item.title}</li> 
                            <li>${item.artist}</li>
                        </div>
                        <button class="add-button" onclick="addSong(${item.url})">+</button>
                    </div>`
                })
            })
        }).catch(err => console.log(err));

}



/*

        <% if(data !== null) {
            data.forEach(song => {%> 
            <% let thumb = JSON.stringify(song.thumbnail) %>
            <% let title = JSON.stringify(song.title) %>
            <% let artist = JSON.stringify(song.artist) %>
            <div class="search-item">
                <img src="<%= song.thumbnail %>" height="175" width="175" alt="Album thumbnail for <%= artist %>">
                <div class="title-artist">
                    <li><%= title %></li> 
                    <li><%= artist %></li>
                </div>
                <button class="add-button" onclick="addSong(' <%= song.url %> ')">+</button>
            </div>
        <% })} %>

    */