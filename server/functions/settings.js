const {
  User
} = require("./../models/user");

const bcrypt = require("bcryptjs");

var updateInformations = (user, oldPassword, newPassword) => {

  new Promise((resolve, reject) => {


    bcrypt.compare(oldPassword, user.password).then((result) => {
      if (!result) {
        reject("La password attuale non corrisponde.");
      } else {
        var newUser = new User(user);
        newUser.save();
        resolve(newUser);
      }
    });

  });

};

module.exports = {
  updateInformations
}