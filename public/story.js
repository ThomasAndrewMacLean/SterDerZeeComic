const api = 'http://localhost:8080/'
const img = document.querySelector('img');
let data = null;
let counter = 0;
let images = [];
fetch(api + 'strip').then(res => res.json()).then(data => {
    console.log(data);
    data = data;

    //LATER PER VIJF INLADEN OFZO?
    data.strip.forEach(d => {
        let i = new Image(500, d.height);
        i.src = d.url;
        images.push(i);
    });

    img.src = images[counter].src;

});


document.addEventListener('click', () => {
    counter++;
    console.log(counter % (images.length));
    img.src = images[counter % (images.length - 1)].src;
});


document.addEventListener('keyup', (e) => {

    if (e.keyCode === 37) //LEFT
    {
        counter--
        if (counter < 0) {
            counter = images.length - 1
        }
    } else if (e.keyCode === 39 || e.keyCode === 32) //RIGHT OR SPACE
    {
        counter++;
    }
    img.src = images[counter % (images.length - 1)].src;
});

let hammer = new Hammer(img);
hammer.on('swipeleft', () => {
    counter--
    if (counter < 0) {
        counter = images.length - 1
    }
    img.src = images[counter % (images.length - 1)].src;
})
hammer.on('swiperight', () => {
    counter++
    img.src = images[counter % (images.length - 1)].src;
})