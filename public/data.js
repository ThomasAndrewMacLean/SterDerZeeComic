const api = document.location.origin + '/';
const dataForm = document.getElementById('dataForm');

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

dataForm.addEventListener('submit', sendData);