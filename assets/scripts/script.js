const nav = document.querySelector("nav");
const messages = document.querySelector("main section");
const divTodos = document.querySelector("#Todos").parentElement;

let nameUser = "";
let privacyContact = "Todos";

let allMessages = "";
let allContacts = "";

let lastTimeMessageUpdate = "00:00:00";

findMessages();

setInterval(function () {
  findContacts();
  findMessages();
}, 3000);

function findMessages() {
  const url = "https://mock-api.driven.com.br/api/v6/uol/messages";

  axios.get(url).then((result) => {
    let data = result.data;
    timeMessage = data[data.length - 1].time;

    if (lastTimeMessageUpdate === timeMessage) return;

    data.forEach(createMessage);

    lastTimeMessageUpdate = timeMessage;
    messages.innerHTML = allMessages;
    messages.scrollIntoView(0);
  });
}

function findContacts() {
  const url = "https://mock-api.driven.com.br/api/v6/uol/participants";
  const contacts = document.querySelector(".contacts");

  axios.get(url).then((result) => {
    let data = result.data;

    allContacts = "";
    data.forEach(createContact);

    if (!data.some((users) => users.name === privacyContact)) {
      selectContact(divTodos);
    }

    contacts.innerHTML = allContacts;
  });
}

function sendMessage() {
  const message = document.querySelector("input#textMessage");

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

  const textSelectedContact = document.querySelector("footer div p");
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

  if (privacyContact === "Todos") {
    textSelectedContact.innerHTML = "";
  } else {
    textSelectedContact.innerHTML = `Enviando mensagem para ${privacyContact}`;
  }
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

function createMessage(message) {
  if (isUserMessage(message)) {
    if (message.type === "message") {
      allMessages += `
            <div class="message status-message">
              <p>
              <span class="time">(${message.time})</span>
              <span class="person">${message.from}</span>para
              <span class="person">${message.to}</span>: ${message.text}
              </p>
            </div>
            `;
    } else if (message.type === "status") {
      allMessages += `
            <div class="message status-info">
              <p>
                <span class="time">(${message.time})</span>
                <span class="person">${message.from}</span>${message.text}
              </p>
            </div>
            `;
    } else if (message.type === "private_message") {
      allMessages += `
            <div class="message status-private">
              <p>
              <span class="time">(${message.time})</span>
              <span class="person">${message.from}</span>para
              <span class="person">${message.to}</span>: ${message.text}
              </p>
            </div>
            `;
    }
  }
}

function isUserMessage(message) {
  if (
    message.to === "Todos" ||
    message.to === nameUser ||
    message.from === nameUser
  ) {
    return true;
  }
}

function createContact(contact) {
  if (contact.name !== nameUser) {
    if (contact.name === privacyContact) {
      allContacts += `
          <div class="contact" onClick="selectContact(this)">
            <ion-icon name="person-circle"></ion-icon>
              <span id="${contact.name}">${contact.name}</span>
            <ion-icon class="selected checkmark" name="checkmark"></ion-icon>
          </div>
        `;
    } else {
      allContacts += `
          <div class="contact" onClick="selectContact(this)">
            <ion-icon name="person-circle"></ion-icon>
              <span id="${contact.name}">${contact.name}</span>
            <ion-icon class="checkmark" name="checkmark"></ion-icon>
          </div>
        `;
    }
  }
}
