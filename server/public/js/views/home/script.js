var loginSubmit = document.getElementsByClassName("login-box__submit")[0];

loginSubmit.addEventListener("click", function() {

  var loginEmail = document.getElementsByClassName("login-box__email-field")[0].value;
  var loginPassword = document.getElementsByClassName("login-box__password-field")[0].value;

  login(loginEmail, loginPassword);

});