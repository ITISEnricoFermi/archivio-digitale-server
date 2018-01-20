// var loginSubmit = document.getElementsByClassName("login-box__submit")[0];
//
// loginSubmit.addEventListener("click", function() {
//
//   var loginEmail = document.getElementsByClassName("login-box__email-field")[0].value;
//   var loginPassword = document.getElementsByClassName("login-box__password-field")[0].value;
//
//   login(loginEmail, loginPassword);
//
// });

let loginApp = new Vue({
  el: "#loginApp",
  data: {
    error: false,
    errorMessage: ""
  },
  methods: {
    login: function() {
      let user = {
        email: this.$refs.loginEmail.value,
        password: this.$refs.loginPassword.value
      };

      console.log(user);

      axios.post("/login", user)
        .then((token) => {
          console.log(token);
          localStorage.setItem('token', token);
          window.location.replace("/");
        })
        .catch((e) => {
          console.log("Errore: ", e);
          this.error = true;
          this.errorMessage = e.response.data;
        });
    }
  }
});