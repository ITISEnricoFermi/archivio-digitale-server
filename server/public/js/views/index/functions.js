function openTab() {

  var li = this;
  var tabName = li.getAttribute("data-tab");
  var menuLeftLi = document.getElementsByClassName("menu-left__li");
  var panel = document.getElementsByClassName("panel");

  // if (li.dataset.tab = "panel--logout") {
  //   return window.location.replace("/logout");
  // }

  // Rimuove la classe attiva da tutte le voci del menù
  for (let i = 0; i < menuLeftLi.length; i++) {
    menuLeftLi[i].classList.remove("menu-left__li--active");
  }

  // Nasconde tutti i pannelli
  for (let i = 0; i < panel.length; i++) {
    panel[i].style.display = "none";
  }

  // Aggiunge la classe attiva alla voce del menù
  li.classList.add("menu-left__li--active");
  // Rende visibile il pannello corrispondente
  document.getElementsByClassName(tabName)[0].style.display = "block";

}

class Admin {
  constructor() {

  }

  addUser(firstname, lastname, email, password, privileges) {

    let user = {
      firstname,
      lastname,
      email,
      password,
      privileges
    }

    var request = new XMLHttpRequest();
    request.open("POST", "/admin/createUser", true);
    request.setRequestHeader("Content-Type", "application/json");

    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        var response = request.responseText;
        var json = JSON.parse(response);
        console.log(json);
      }
    };

    var data = JSON.stringify(user);
    request.send(data);

  }

}

class PopUp {
  constructor(popUp, popUpTitle, popUpDescription, popUpClose) {
    this.popUp = popUp;
    this.popUpTitle = popUpTitle;
    this.popUpDescription = popUpDescription;
    this.popUpClose = popUpClose;
  }

  showPopUp() {
    this.popUp.style.visibility = "visibile";
    this.popUp.style.opacity = 1;
  }

  closePopUp() {
    this.popUp.style.opacity = 0;
    this.popUp.style.visibility = "hidden";
  }
}