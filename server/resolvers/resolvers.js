module.exports = {
  Query: {
    user: (root, { firstname }, context) => {
      return {
        firstname: firstname ? firstname : "Hello",
        lastname: "String",
        email: "String",
        password: "String",
        accesses: [
          {
            id: "a"
          },
          {
            id: "b"
          }
        ],
        privileges: "String",
        state: "String"
      };
    }
  }
};