const nav = document.querySelector("nav");
const messages = document.querySelector("main section");

let nameUser = "";
let privacyContact = "Todos";
let countPersons = 0;

let lastTimeMessage = "00:00:00";

function findMessages() {
  const url = "https://mock-api.driven.com.br/api/v6/uol/messages";
  axios.get(url).then(function (result) {
    let data = result.data;
    let allMessages = "";
    timeMessage = data[data.length - 1].time;

    if (lastTimeMessage === timeMessage) return;

    for (let i = 0; i < data.length; i++) {
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

    if (countPersons !== data.length) {
      for (let i = countPersons; i < data.length; i++) {
        contacts.innerHTML += `
          <div class="contact" onClick="selectContact(this)">
            <ion-icon name="person-circle"></ion-icon>
              <span id="João">${data[i].name}</span>
            <ion-icon class="checkmark" name="checkmark"></ion-icon>
          </div>
        `;
      }

      countPersons = data.length;
    }
  });
}

findMessages();

function sendMessage() {
  let message = document.querySelector("input#textMessage");

  if (privacyContact !== "Todos") {
    typeMessage = "message_private";
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
    .then(function (response) {
      console.log(response);
    })
    .catch(function () {
      alert("Vocês foi desconectado");
      window.location.reload();
    });

  message.value = "";
}

function showNav() {
  nav.classList.remove("hidden");
}

function hiddenNav() {
  nav.classList.add("hidden");
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
    .then(function () {
      findContacts();
      findMessages();
    })
    .catch(function () {
      alert("Não foi possível manter conexão");
    });
}

function selectContact(contact) {
  const previousSelected = document.querySelector(
    ".contact .checkmark.selected"
  );
  if (previousSelected != null) {
    previousSelected.classList.remove("selected");
  }

  const selected = contact.querySelector("ion-icon.checkmark");
  selected.classList.add("selected");

  if (contact.querySelector("span").id !== "all") {
    selectPrivacy("private");
  } else {
    selectPrivacy("public");
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
  (event) => {
    if (event.code === "Enter") {
      sendMessage();
    }
  },
  false
);
