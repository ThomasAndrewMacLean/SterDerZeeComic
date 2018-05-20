const button = document.querySelector('#uploadButton');
const cancelButton = document.querySelector('#cancelButton');
const fileInput = document.querySelector('#fileInput');
const form = document.querySelector('form');
const canvas = document.querySelector('canvas');
const loading = document.querySelector('.loading');
const body = document.querySelector('body');

button.disabled = true;
const api = 'http://localhost:8080/uploadfile'

let uploadFile;

drawImageToCanvas = (file) => {

    form.querySelector('input[name="name"]').value = file.name;
    button.disabled = false;
    console.log(file);

    var ctx = canvas.getContext('2d');
    var img = new Image;
    img.onload = function () {
        var hRatio = canvas.width / img.width;
        var vRatio = canvas.height / img.height;
        var ratio = Math.min(hRatio, vRatio);
        canvas.height = img.height * ratio;
        canvas.width = img.width * ratio;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * ratio, img.height * ratio);
        // ctx.drawImage(img, 0, 0, img.width, img.height);
        // ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 300, 150);
    }
    img.src = URL.createObjectURL(file);
}

changeEventHandler = (evt) => {

    drawImageToCanvas(evt.target.files[0]);

}

clearAllData = () => {
    uploadFile = null;
    fileInput.files[0] = null;
    button.disabled = true;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

uploadFileToServer = (evt) => {
    evt.preventDefault();

    loading.classList.add('show');
    let fd = new FormData(form);
    let name = fd.get('name');
    let desc = fd.get('desc')

    if (uploadFile) {
        fd = new FormData();
        fd.append('image', uploadFile);
    }

    fetch(api + `?name=${name}&desc=${desc}`, {
        method: 'POST',
        body: fd,
        processData: false,
        headers: {

        }

    }).then(res => res.json()).then(json => {
        clearAllData();
        loading.classList.remove('show');
        console.log(json)
    })

}

prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
}

body.addEventListener('drag', prevent)
body.addEventListener('dragstart', prevent)
body.addEventListener('dragend', prevent)
body.addEventListener('dragover', prevent)
body.addEventListener('dragenter', prevent)
body.addEventListener('dragleave', prevent)
body.addEventListener('drop', prevent)

body.addEventListener('dragover', function () {
    body.classList.add('is-dragover');
})

body.addEventListener('dragenter', function () {
    body.classList.add('is-dragover');
})
body.addEventListener('dragleave', function () {
    body.classList.remove('is-dragover');
})
body.addEventListener('dragend', function () {
    body.classList.remove('is-dragover');
})
body.addEventListener('drop', function () {
    body.classList.remove('is-dragover');
})
body.addEventListener('drop', function (e) {
    let file = e.dataTransfer.files[0];

    uploadFile = file;

    drawImageToCanvas(file);

});

button.addEventListener('click', uploadFileToServer);
cancelButton.addEventListener('click', clearAllData);