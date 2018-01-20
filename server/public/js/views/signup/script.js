let signupApp = new Vue({
  el: "#signupApp",
  data: {
    signedUp: false,
    error: false,
    errorMessage: ""
  },
  methods: {
    signup: function() {

      var user = {
        firstname: this.$refs.signupFirstame.value,
        lastname: this.$refs.signupLastname.value,
        email: this.$refs.signupEmail.value,
        password: this.$refs.signupPassword.value
      };

      axios.post("/signup", user)
        .then((user) => {
          if (user) {
            this.signedUp = true;
          }
        })
        .catch((e) => {
          console.log("Errore: ", e.response.data);
          this.error = true;
          this.errorMessage = e.response.data;
        });
    }
  }
});