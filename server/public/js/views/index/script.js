var menuLeftLi = document.getElementsByClassName("menu-left__li");

for (var i = 0; i < menuLeftLi.length; i++) {
  menuLeftLi[i].addEventListener("click", openTab);
}

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
    },
    upload: function() {

      let formData = new FormData();
      let config = {
        onUploadProgress: function(progressEvent) {
          let actualProgress = progressEvent.loaded;
          let totalProgress = progressEvent.total;
          let progress = Math.floor((actualProgress * 100) / totalProgress);
          this.uploading = true;
          this.progress = progress;
          this.response = true;

          if (progress === 100) {
            this.uploading = false;
          }

        }
      };

      let document = {
        name: this.$refs.uploadName.value,
        type: this.$refs.uploadType.value,
        faculty: this.$refs.uploadFaculty.value,
        subject: this.$refs.uploadSubject.value,
        class: this.$refs.uploadClass.value,
        section: this.$refs.uploadSection.value,
        visibility: this.$refs.uploadVisibility.value,
        description: this.$refs.uploadDescription.value
      }

      document = JSON.stringify(document);

      let file = this.$refs.uploadFile.files[0];

      formData.append("document", document);
      formData.append("fileToUpload", file);

      axios.post("upload/documentUpload", formData, config)
        .then((response) => {
          this.response = true;
          this.responseMessage = response.data;

          this.$refs.uploadName.value = "";
          this.$refs.uploadType.value = "";
          this.$refs.uploadFaculty.value = "";
          this.$refs.uploadSubject.value = "";
          this.$refs.uploadClass.value = "";
          this.$refs.uploadSection.value = "";
          this.$refs.uploadVisibility.value = "";
          this.$refs.uploadDescription.value = "";

        })
        .catch((e) => {
          console.log(e.response.data);
          this.response = true;
          this.responseMessage = e.response.data;
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
    schoolClasses: "",
    response: false,
    responseMessage: "",
    progress: 0,
    uploading: false
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

var panelSettings = new Vue({
  el: "#panel-settings",
  data: {
    response: false,
    responseMessage: ""
  },
  methods: {
    saveSettings: function() {
      let oldPassword = this.$refs.settingsOldPassword.value;
      let newPassword = this.$refs.settingsNewPassword.value;

      axios.post("/settings/updateInformations", {
          oldPassword,
          newPassword
        })
        .then(() => {
          window.location.replace("/login");
        })
        .catch((e) => {
          this.response = true;
          this.responseMessage = e.response.data;
        });
    },
    uploadProfilePic: function() {
      let profilePic = this.$refs.settingsProfilePic.files[0];

      let formData = new FormData();

      formData.append("picToUpload", profilePic);

      axios.post("/settings/updateProfilePic", formData)
        .then((message) => {
          this.response = true;
          this.responseMessage = message.data;
        })
        .catch((e) => {
          this.response = true;
          this.responseMessage = e.response.data;
        });
    },
    disableAccount: function() {

    }
  }
});