const api = 'http://localhost:8080/'

let volgorde;
let dragCard = null;
let dropCard = null;

ondrag_handler = (evt) => {
    if (dragCard === null) {
        dragCard = evt.target.id
        evt.target.classList.remove('bovensteHelft')
        evt.target.classList.remove('ondersteHelft')
    }
}
dragover_handler = (evt) => {
    evt.preventDefault()

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

delete_handler = (evt) => {
    let id = evt.target.id;
    index = volgorde.volgorde.indexOf(id);

    volgorde.volgorde.splice(index, 1);

    fetch(api + 'setVolgorde', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "same-origin",
        body: JSON.stringify({
            nieuweVolgorde: volgorde,
        }),
    }).then(res => {
        if (res.status === 200) {
            location.reload();

        }
    })



}
drop_handler = (evt) => {
    dropCard = evt.target.id;

    let erboven = evt.target.classList.contains('bovensteHelft');

    console.log(erboven);
    if (!dragCard || !dropCard) {
        console.log('??? hoe kan dat');
        evt.target.classList.remove('bovensteHelft')
        evt.target.classList.remove('ondersteHelft')
        dragCard = null;
        dropCard = null;
        return;
    }


    if (dropCard === dragCard) {
        console.log('zelfde kaart')

    } else {
        indexDrag = volgorde.volgorde.indexOf(dragCard);
        indexDrop = volgorde.volgorde.indexOf(dropCard);

        if (!erboven) {
            indexDrop++
        }


        volgorde.volgorde.splice(indexDrag, 1);
        volgorde.volgorde.splice(indexDrop, 0, dragCard)

        fetch(api + 'setVolgorde', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
            body: JSON.stringify({
                nieuweVolgorde: volgorde,
            }),
        }).then(res => {
            if (res.status === 200) {
                location.reload();

            }
        })

    }
    evt.target.classList.remove('bovensteHelft')
    evt.target.classList.remove('ondersteHelft')
    dragCard = null;
    dropCard = null;
}

fetch(api + 'getVolgordeJson').then(x => x.json()).then(x => {
    volgorde = x;
});