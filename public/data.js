const api = document.location.origin + '/';
const dataForm = document.getElementById('dataForm');
const code = document.getElementById('code');
const html = document.getElementById('omschrijving');
const succes = document.getElementById('succes');

const object = {};
new FormData(dataForm).forEach((value, key) => {
  object[key] = value;
});
let initialFormData = JSON.stringify(object);

const sendData = e => {
  e.preventDefault();
  const object = {};
  new FormData(dataForm).forEach((value, key) => {
    object[key] = value;
  });
  const jsonFormData = JSON.stringify(object);

  if (initialFormData === jsonFormData) {
    console.log('sameData');

    return;
  }

  initialFormData = jsonFormData;
  fetch(api + 'saveFormData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: jsonFormData
  }).then(res => {
    if (res.status === 200) {
      succes.style.display = 'inline';
      setInterval(() => {
        succes.style.display = 'none';
      }, 5000);
    }
  });
};

code.innerHTML = html.value;

document.body.onkeyup = () => {
  code.innerHTML = html.value;
};

dataForm.addEventListener('submit', sendData);