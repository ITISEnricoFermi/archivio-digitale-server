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