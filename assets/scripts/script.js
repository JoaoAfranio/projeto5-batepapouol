const nav = document.querySelector("nav");
const messages = document.querySelector("main section");
let nameUser = "";
let privacyContact = "Todos";
let countMessages = 0;
let countPersons = 0;

function findMessages() {
  const url = "https://mock-api.driven.com.br/api/v6/uol/messages";
  axios.get(url).then(function (result) {
    let data = result.data;

    console.log("countMessages: " + countMessages);
    console.log("result.data.length " + data.length);
    if (countMessages !== data.length) {
      for (let i = countMessages; i < data.length; i++) {
        if (data[i].type === "message") {
          messages.innerHTML += `
          <div class="message status-message">
            <p>
            <span class="time">(${data[i].time})</span>
            <span class="person">${data[i].from}</span>para
            <span class="person">${data[i].to}</span>: ${data[i].text}
            </p>
          </div>
          `;
        }

        if (data[i].type === "status") {
          messages.innerHTML += `
          <div class="message status-info">
            <p>
              <span class="time">(${data[i].time})</span>
              <span class="person">${data[i].from}</span>${data[i].text}
            </p>
          </div>
          `;
        }

        if (data[i].type === "private_message") {
          messages.innerHTML += `
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
      countMessages = data.length;
    }
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
    .catch(function (error) {
      console.log(error);
    });

  message.value = "";
}

function hiddenElement(element) {
  element.classList.add("hidden");
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
    .catch(function (error) {
      alert(error);
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
