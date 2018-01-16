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
      }).catch((e) => {
        this.errors.push(e)
      });

    axios.post("/api/getFaculties/")
      .then((response) => {
        this.faculties = response.data
      }).catch((e) => {
        this.errors.push(e)
      });

    axios.post("/api/getDocumentVisibilityList")
      .then((response) => {
        this.visibilities = response.data
      }).catch((e) => {
        this.errors.push(e)
      });

    axios.post("/api/getSections")
      .then((response) => {
        this.sections = response.data
      }).catch((e) => {
        this.errors.push(e);
      });

    axios.post("/api/getClasses")
      .then((response) => {
        this.schoolClasses = response.data;
      }).catch((e) => {
        this.errors.push(e);
      });

  },
  methods: {
    changeFaculty: function() {
      axios.post("/api/getSubjectsByFaculty/", {
          _id: this.selectedFaculty
        })
        .then((response) => {
          this.subjects = response.data
        }).catch((e) => {
          this.errors.push(e)
        });
    }
  },
  data: {
    types: "",
    faculties: "",
    selectedFaculty: "",
    subjects: "",
    visibilities: "",
    sections: "",
    schoolClasses: ""
  }
});

// PANEL SEARCH

var panelSearch = new Vue({
  el: "#panel-search",
  created() {
    axios.post("/api/getFaculties/")
      .then((response) => {
        this.faculties = response.data;
      }).catch((e) => {
        this.errors.push(e);
      });

    axios.post("/api/getSections")
      .then((response) => {
        this.sections = response.data;
      }).catch((e) => {
        this.errors.push(e);
      });

    axios.post("/api/getDocumentTypes/")
      .then((response) => {
        this.types = response.data;
      }).catch((e) => {
        this.errors.push(e);
      });

    axios.post("/api/getDocumentVisibilityList/")
      .then((response) => {
        this.visibilities = response.data;
      }).catch((e) => {
        this.errors.push(e);
      });

    axios.post("/api/getClasses/")
      .then((response) => {
        this.schoolClasses = response.data;
      }).catch((e) => {
        this.errors.push(e);
      });
  },
  methods: {
    search: function() {
      axios.post("/search/searchDocuments/", {
          name: document.getElementById("search-name").value,
          type: document.getElementById("search-type").value,
          faculty: document.getElementById("search-faculty").value,
          subject: document.getElementById("search-subject").value,
          class: document.getElementById("search-class").value,
          section: document.getElementById("search-section").value,
          visibility: document.getElementById("search-visibility").value
        })
        .then((response) => {
          this.documents = response.data
        })
        .catch((e) => {
          this.errors.push(e);
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
    selectedFaculty: "",
    faculties: "",
    types: "",
    documents: "",
    subjects: "",
    visibilities: "",
    sections: "",
    schoolClasses: ""
  }
});


// PANEL ADMIN

var panelAdmin = new Vue({
  el: "#panel-admin",
  data: {
    key: "",
    users: "",
    privileges: "",
    requests: []
  },
  created() {
    axios.post("/api/getPrivileges")
      .then((response) => {
        this.privileges = response.data;
      })
      .catch((e) =>  {
        this.errors.push(e);
      });

    axios.post("/admin/getRequests")
      .then((response) => {
        this.requests = response.data;
      })
      .catch((e) => {
        this.errors.push(e);
      });
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