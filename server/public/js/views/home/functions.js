function login(email, password) {

  var request = new XMLHttpRequest();

  request.open("POST", "/login", true);
  request.setRequestHeader("Content-Type", "application/json");

  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      var response = request.responseText;
      var token = JSON.parse(response);
      localStorage.setItem('token', token.token);
      window.location.reload();
    }
  };

  var data = JSON.stringify({
    email,
    password
  });

  request.send(data);

}