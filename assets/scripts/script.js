const nav = document.querySelector("nav");

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
  login.classList.add("hidden");

  const main = document.querySelector("main");
  main.classList.remove("hidden");
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
}

function selectPrivacy(privacy) {
  const previousSelected = document.querySelector(
    ".privacy .checkmark.selected"
  );

  if (previousSelected != null) {
    previousSelected.classList.remove("selected");
  }
  const selected = privacy.querySelector("ion-icon.checkmark");
  selected.classList.add("selected");
}
