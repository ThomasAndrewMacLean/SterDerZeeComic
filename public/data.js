const api = document.location.origin + '/';
const dataForm = document.getElementById('dataForm');
var code = document.getElementById('code').contentWindow.document;
var html = document.getElementById('omschrijving');

const sendData = e => {
  e.preventDefault();
  var object = {};
  new FormData(dataForm).forEach((value, key) => {
    object[key] = value;
  });
  var jsonFormData = JSON.stringify(object);
  fetch(api + 'saveFormData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: jsonFormData
  }).then(res => {
    if (res.status === 200) {
      console.log('it worked');

      //  location.reload();
    }
  });
};

code.open();
  code.writeln(html.value);
  code.close();

document.body.onkeyup = function () {
  code.open();
  code.writeln(html.value);
  code.close();
};

dataForm.addEventListener('submit', sendData);