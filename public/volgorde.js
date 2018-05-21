const api = 'http://localhost:8080/getImages'

dragover_handler = (evt) => {
    //console.log(evt);

    let bovensteHelft = evt.target.offsetHeight / 2 + evt.target.offsetTop > evt.pageY;

    if (bovensteHelft) {
        evt.target.classList.add('bovensteHelft')
        evt.target.classList.remove('ondersteHelft')
    } else {
        evt.target.classList.add('ondersteHelft')
        evt.target.classList.remove('bovensteHelft')
    }
}
dragleave_handler = (evt) => {
    evt.target.classList.remove('bovensteHelft')
    evt.target.classList.remove('ondersteHelft')
}