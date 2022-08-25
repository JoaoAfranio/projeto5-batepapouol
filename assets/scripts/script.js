const nav = document.querySelector("nav");
const messages = document.querySelector("main section");

let nameUser = "";
let privacyContact = "Todos";
let privacy = "";

let lastTimeMessage = "00:00:00";

findMessages();

setInterval(function () {
  findContacts();
  findMessages();
}, 3000);

function findMessages() {
  const url = "https://mock-api.driven.com.br/api/v6/uol/messages";

  axios.get(url).then(function (result) {
    let data = result.data;
    let allMessages = "";
    timeMessage = data[data.length - 1].time;

    if (lastTimeMessage === timeMessage) return;

    for (let i = 0; i < data.length; i++) {
      if (
        data[i].to === "Todos" ||
        data[i].to === nameUser ||
        data[i].from === nameUser
      ) {
        if (data[i].type === "message") {
          allMessages += `
            <div class="message status-message">
              <p>
              <span class="time">(${data[i].time})</span>
              <span class="person">${data[i].from}</span>para
              <span class="person">${data[i].to}</span>: ${data[i].text}
              </p>
            </div>
            `;
        } else if (data[i].type === "status") {
          allMessages += `
            <div class="message status-info">
              <p>
                <span class="time">(${data[i].time})</span>
                <span class="person">${data[i].from}</span>${data[i].text}
              </p>
            </div>
            `;
        } else if (data[i].type === "private_message") {
          allMessages += `
            <div class="message status-private">
              <p>
              <span class="time">(${data[i].time})</span>
              <span class="person">${data[i].from}</span>para
              <span class="person">${data[i].to}</span>: ${data[i].text}
              </p>
            </div>
            `;
        }
      }
    }

    lastTimeMessage = timeMessage;
    messages.innerHTML = allMessages;
    messages.scrollIntoView(0);
  });
}

function findContacts() {
  const url = "https://mock-api.driven.com.br/api/v6/uol/participants";
  const contacts = document.querySelector(".contacts");

  axios.get(url).then(function (result) {
    let data = result.data;
    let allContacts = "";

    for (let i = 0; i < data.length; i++) {
      if (data[i].name !== nameUser) {
        if (data[i].name === privacyContact) {
          allContacts += `
          <div class="contact" onClick="selectContact(this)">
            <ion-icon name="person-circle"></ion-icon>
              <span id="${data[i].name}">${data[i].name}</span>
            <ion-icon class="selected checkmark" name="checkmark"></ion-icon>
          </div>
        `;
        } else {
          allContacts += `
          <div class="contact" onClick="selectContact(this)">
            <ion-icon name="person-circle"></ion-icon>
              <span id="${data[i].name}">${data[i].name}</span>
            <ion-icon class="checkmark" name="checkmark"></ion-icon>
          </div>
        `;
        }
      }
    }

    contacts.innerHTML = allContacts;
  });
}

function sendMessage() {
  let message = document.querySelector("input#textMessage");

  if (privacyContact !== "Todos") {
    typeMessage = "private_message";
  } else {
    typeMessage = "message";
  }

  if (message.value === "") {
    alert("Digite uma messagem");
    return;
  }

  const url = "https://mock-api.driven.com.br/api/v6/uol/messages";
  axios
    .post(url, {
      from: nameUser,
      to: privacyContact,
      text: message.value,
      type: typeMessage,
    })
    .then(function () {
      findMessages();
    })
    .catch(function () {
      alert("Vocês foi desconectado");
      window.location.reload();
    });

  message.value = "";
}

function login() {
  const login = document.querySelector(".login");
  const input = document.querySelector(".login input");

  nameUser = input.value;

  const url = "https://mock-api.driven.com.br/api/v6/uol/participants";
  axios
    .post(url, {
      name: nameUser,
    })
    .then(function () {
      login.classList.add("hidden");

      const main = document.querySelector("main");
      main.classList.remove("hidden");

      maintainConection();
    })
    .catch(function () {
      alert("Nome invalido, digite outro nome");
    });
}

function maintainConection() {
  setInterval(conection, 5000);
}

function conection() {
  const url = "https://mock-api.driven.com.br/api/v6/uol/status";

  axios
    .post(url, {
      name: nameUser,
    })
    .catch(function () {
      alert("Não foi possível manter conexão");
    });
}

function selectContact(contact) {
  const previousSelected = document.querySelector(
    ".contact .checkmark.selected"
  );
  if (previousSelected !== null) {
    previousSelected.classList.remove("selected");
  }

  const selected = contact.querySelector("ion-icon.checkmark");
  selected.classList.add("selected");

  if (contact.querySelector("span").id !== "Todos") {
    selectPrivacy("private");
  } else {
    selectPrivacy("public");
  }

  privacyContact = contact.querySelector("span").id;
}

function selectPrivacy(typePrivacy) {
  const previousSelected = document.querySelector(
    ".privacy .checkmark.selected"
  );

  if (previousSelected != null) {
    previousSelected.classList.remove("selected");
  }

  const selected = document.querySelector(
    `.privacy#${typePrivacy} ion-icon.checkmark`
  );
  selected.classList.add("selected");
  privacy = typePrivacy;
}

document.addEventListener(
  "keydown",
  function (event) {
    if (event.code === "Enter") {
      sendMessage();
    }
  },
  false
);

function showNav() {
  nav.classList.remove("hidden");
}

function hiddenNav() {
  nav.classList.add("hidden");
}
