var menuLeftLi = document.getElementsByClassName("menu-left__li");

for (let i = 0; i < menuLeftLi.length; i++) {
  menuLeftLi[i].addEventListener("click", openTab);
}

var userAdmin = new Admin();


var adminCreateSubmit = document.getElementById("admin__create-user--submit");

adminCreateSubmit.addEventListener("click", () => {

  let adminCreateFirstName = document.getElementById("admin__create-user--firstname").value;
  let adminCreateLastName = document.getElementById("admin__create-user--lastname").value;
  let adminCreateEmail = document.getElementById("admin__create-user--email").value;
  let adminCreatePassword = document.getElementById("admin__create-user--password").value;
  let adminCreatePrivileges = document.getElementById("admin__create-user--privileges").value;

  userAdmin.addUser(adminCreateFirstName, adminCreateLastName, adminCreateEmail, adminCreatePassword, adminCreatePrivileges)
});

var popUpClose = document.getElementsByClassName("popup-close")[0];
var popUp = document.getElementsByClassName("popup")[0];

popUpClose.addEventListener("click", function() {
  popUp.style.opacity == 0;
  popUp.style.visibility == "hidden";
});

// PANEL UPLOAD

var panelUpload = new Vue({
  el: "#panel-upload",
  created() {
    axios.post("/api/getDocumentTypes/")
      .then((response) => {
        this.types = response.data
      })
      .catch((e) => {
        this.errors.push(e)
      });

    axios.post("/api/getFaculties/")
      .then((response) => {
        this.faculties = response.data
      })
      .catch((e) => {
        this.errors.push(e)
      });
  },
  methods: {
    changeFaculty: function() {
      axios.post("/api/getSubjectsByFaculty/", {
          _id: this.selectedFaculty
        })
        .then((response) => {
          this.subjects = response.data
        })
        .catch((e) => {
          this.errors.push(e)
        });
    }
  },
  data: {
    types: "",
    faculties: "",
    selectedFaculty: "",
    subjects: ""
  }
});

// PANEL ADVANCED SEARCH

var panelAdvancedSearch = new Vue({
  el: "#panel-advanced-search",
  created() {
    axios.post("/api/getFaculties/")
      .then((response) => {
        this.faculties = response.data
      })
      .catch((e) => {
        this.errors.push(e)
      });

    axios.post("/api/getDocumentTypes/")
      .then((response) => {
        this.types = response.data
      })
      .catch((e) => {
        this.errors.push(e)
      });
  },
  methods: {
    search: function() {
      axios.post("/api/searchAdvancedDocuments/", {
          name: document.getElementById("advanced-search-name").value,
          type: document.getElementById("advanced-search-type").value,
          faculty: document.getElementById("advanced-search-faculty").value,
          subject: document.getElementById("advanced-search-subject").value,
          class: document.getElementById("advanced-search-class").value,
          section: document.getElementById("advanced-search-section").value,
          visibility: document.getElementById("advanced-search-visibility").value
        })
        .then((response) => {
          this.documents = response.data
        })
        .catch((e) => {
          this.erros.push(e);
        });
    },

    changeFaculty: function() {
      axios.post("/api/getSubjectsByFaculty/", {
          _id: this.selectedFaculty
        })
        .then((response) => {
          this.subjects = response.data
        })
        .catch((e) => {
          this.errors.push(e)
        });
    }

  },
  data: {
    faculties: "",
    types: "",
    documents: "",
    selectedFaculty: "",
    subjects: ""
  }
});


// PANEL ADMIN

var panelAdmin = new Vue({
  el: "#panel-admin",
  data: {
    key: "",
    users: ""
  },
  methods: {
    search: function() {
      axios.post("/admin/getUsers/", {
          key: this.key
        })
        .then((response) => {
          this.users = response.data;
        })
        .catch((e) => {
          this.errors.push(e)
        });
    }
  }
});

// PANEL SETTINGS

var moduleInputSelectsSettingsSubject = new Vue({
  el: "#module-input-select-settings--subject",
  created() {
    axios.post("/api/getFaculties/")
      .then((response) => {
        this.faculties = response.data
      })
      .catch((e) => {
        this.errors.push(e)
      });
  },
  data: {
    faculties: ""
  }
});