// const validate = () => {
//     const artist = document.getElementById('artist').innerHTML;
//     const title = document.getElementById('title').innerHTML;
//     let ctx1 = document.getElementById('chart1').getContext('2d');
//     let ctx2 = document.getElementById('chart2').getContext('2d');
// }

const showUniqueOption = op => {
    let uniq = document.getElementById('unique-selector');
    console.log(op, 'selected');
    if (op == 'two-chart') {
        let content = document.createElement('div');
        content.id = 'dropdown'
        content.innerHTML = `<label for="unique">Unique Words Only</label> <input type="checkbox" name="unique" id="unique">`
        uniq.insertAdjacentElement('afterbegin', content);
    }
    else {
        console.log('False!')
        let dropdown = document.getElementById('dropdown');
        if (dropdown != null) {
            dropdown.parentElement.removeChild(dropdown);
        }
    }
}

const addSong = url => {
    fetch(`/song?url=${encodeURIComponent(url)}`)
        .then(jsnr => console.log(jsnr))
        .catch(err => console.log(err));
}