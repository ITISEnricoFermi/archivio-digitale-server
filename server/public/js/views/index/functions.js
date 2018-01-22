function openTab(event) {

  var li = this;
  var tabName = li.getAttribute("data-tab");
  var menuLeftLi = document.getElementsByClassName("menu-left__li");
  var panel = document.getElementsByClassName("panel");

  // if (li.dataset.tab = "panel--logout") {
  //   return window.location.replace("/logout");
  // }

  // Rimuove la classe attiva da tutte le voci del menù
  for (var i = 0; i < menuLeftLi.length; i++) {
    menuLeftLi[i].classList.remove("menu-left__li--active");
  }

  // Nasconde tutti i pannelli
  for (var i = 0; i < panel.length; i++) {
    panel[i].style.display = "none";
  }

  // Aggiunge la classe attiva alla voce del menù
  li.classList.add("menu-left__li--active");
  // Rende visibile il pannello corrispondente
  document.getElementsByClassName(tabName)[0].style.display = "block";

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