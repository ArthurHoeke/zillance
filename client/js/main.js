const apiAddress = "https://h2910056.stratoserver.net:80";

var notyf;
var selectedMenu = 0;

window.addEventListener('DOMContentLoaded', (event) => {
  notyf = new Notyf({
    duration: 2000,
    position: {
      x: 'right',
      y: 'top',
    },
    types: [
      {
        type: 'warning',
        background: 'orange',
        icon: {
          className: 'material-icons',
          tagName: 'i',
          text: 'warning'
        }
      },
      {
        type: 'error',
        background: 'indianred',
        duration: 2000,
        dismissible: true
      }
    ]
  });

  setupMenuButtons();
  setupCreateProjectButton();
  setupSubmitProject();

  refreshProjectList();
});

function setupMenuButtons() {
  const buttons = document.getElementsByTagName("li");
  const activeBackdrop = document.getElementById("activeBackdrop");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      //set backdrop Y position
      activeBackdrop.style.marginTop = (140 + (75 * i)) + "px";

      //remove active ID from old button and add to newly selected
      document.getElementById("active").removeAttribute("id");
      buttons[i].setAttribute("id", "active");
      selectedMenu = i;
      refreshProjectList();
    });
  }

  const mobileTabOpener = document.getElementById("mobileNavPopup");
  const mobileNavIcon = document.getElementById('mobileNavIcon');
  const navbar = document.getElementById("nav");

  mobileTabOpener.addEventListener('click', function () {
    if (navbar.classList.contains('mobileOpen')) {
      navbar.classList.remove('mobileOpen');
      mobileNavIcon.setAttribute('src', "img/icons/menu.svg");
    } else {
      navbar.classList.add('mobileOpen');
      mobileNavIcon.setAttribute('src', "img/icons/close.svg");
    }
  });
}

function setupCreateProjectButton() {
  const menuButton = document.getElementById("openProjectForm");

  menuButton.addEventListener('click', function () {
    switchMenu();
  });
}

function switchMenu() {
  const projectForm = document.getElementById("projectForm");
  if (projectForm.hidden) {
    projectForm.hidden = false;
  } else {
    projectForm.hidden = true;
  }
}

function progressProjectList(response) {
  const projectListElement = document.getElementById("projectList");

  for (let i = 0; i < response.length; i++) {
    //create project container
    const article = document.createElement("article");
    article.classList.add("projectContainer");

    //add to project list
    projectListElement.appendChild(article);

    //create top part of container
    const articleTop = document.createElement("div");
    articleTop.classList.add("top");

    const articleTitle = document.createElement("div");
    articleTitle.classList.add("title");
    articleTop.appendChild(articleTitle);

    const titleP = document.createElement("p");
    titleP.innerHTML = response[i].title;
    articleTitle.appendChild(titleP);

    const titleSmall = document.createElement("small");
    titleSmall.innerHTML = response[i].creationDate;
    articleTitle.appendChild(titleSmall);

    const articlePrice = document.createElement("div");
    articlePrice.classList.add("price");
    articleTop.appendChild(articlePrice);

    const priceP = document.createElement("p");
    priceP.innerHTML = response[i].bounty;
    articlePrice.appendChild(priceP);

    const priceImg = document.createElement("img");
    priceImg.src = "img/icons/zil.svg";
    articlePrice.appendChild(priceImg);

    article.appendChild(articleTop);

    const projectDescription = document.createElement("p");
    projectDescription.classList.add("description");
    projectDescription.innerHTML = response[i].description;
    article.appendChild(projectDescription);

    const articleTags = document.createElement("div");
    articleTags.classList.add("tags");
    article.appendChild(articleTags);

    var tags = response[i].tags.split(",");
    for (let i2 = 0; i2 < tags.length; i2++) {
      const tag = document.createElement("p");
      tag.innerHTML = tags[i2];
      articleTags.appendChild(tag);
    }

    const del = document.createElement("p");
    del.classList.add("delbutton");
    del.innerHTML = "<img src='img/icons/delete.svg'>";
    del.addEventListener('click', function () {
      deleteProject(response[i].id);
    });

    articleTags.appendChild(del);
  }
}

function refreshProjectList() {
  const projects = document.getElementsByClassName("projectContainer");
  let list = [];

  for (let i = 0; i < projects.length; i++) {
    list.push(projects[i]);
  }

  list.forEach(function (entry) {
    entry.remove();
  });


  if (selectedMenu == 0) {
    $.ajax({
      url: apiAddress + "/projects/all",
      type: "GET",
      success: function (response) {
        progressProjectList(response);
      },
      error: function (err) {
        notyf.error('Error occurred');
      }
    });
  } else {
    const categories = ['finance', 'games', 'nft', 'misc'];

    $.ajax({
      url: apiAddress + "/projects/" + categories[selectedMenu - 1],
      type: "GET",
      success: function (response) {
        progressProjectList(response);
      },
      error: function (err) {
        notyf.error('Error occurred');
      }
    });
  }
}

let cooldown = false;

function deleteProject(id) {
  $.confirm({
    title: 'Delete project',
    content: '' +
      '<form action="" class="formName">' +
      '<div class="form-group">' +
      '<label>Please enter the project private key. Lost your private key? Please contact Zillacracy.</label>' +
      '<input type="text" placeholder="Private key" class="key form-control" required />' +
      '</div>' +
      '</form>',
    buttons: {
      formSubmit: {
        text: 'Submit',
        btnClass: 'btn-blue',
        action: function () {
          var key = this.$content.find('.key').val();
          if (!key) {
            $.alert('provide a valid key.');
            return false;
          }
          //sent delete request
          $.ajax({
            url: apiAddress + "/delete/" + key,
            type: "GET",
            success: function (response) {
              notyf.success('Project deleted');
              refreshProjectList();
            },
            error: function (err) {
              notyf.error('Incorrect private key');
              return false;
            }
          });
        }
      },
      cancel: function () {
        //close
      },
    },
    onContentReady: function () {
      // bind to events
      var jc = this;
      this.$content.find('form').on('submit', function (e) {
        // if the user submits the form by pressing enter in the field.
        e.preventDefault();
        jc.$$formSubmit.trigger('click'); // reference the button and click it
      });
    }
  });
}

function setupSubmitProject() {
  var tags = new Tags('.tagged');

  const submitButton = document.getElementById("submitForm");
  submitButton.addEventListener('click', function () {
    if (cooldown == false) {
      const title = document.getElementById("formTitle").value;

      let description = document.getElementById("formFullDescription").value;
      description = description.replace(/(?:\r\n|\r|\n)/g, '<br>');

      const category = document.getElementById("category").value;

      let formPrice = document.getElementById("formPrice").value;
      formPrice.replace(',', "");
      formPrice.replace('.', "");

      if (title.length < 5 || title.length > 60) {
        notyf.error("Title is either too short or too long");
        return;
      } else if (description.length < 20 || description.length > 800) {
        notyf.error("Description is either too short or too long");
        return;
      } else if (category == "") {
        notyf.error("Please select a category");
        return;
      } else if (formPrice == "") {
        notyf.error("Please add a bounty offer");
        return;
      }

      $.ajax({
        url: apiAddress + "/createproject",
        headers: { 'title': title, 'description': description, 'bounty': formPrice, 'tags': tags.getTags(), 'category': category },
        type: "GET",
        success: function (response) {
          cooldown = true;
          refreshProjectList();
          switchMenu();
          notyf.success("Project created!");
          $.confirm({
            title: 'Private key',
            content: '' +
              '<form action="" class="formName">' +
              '<div class="form-group">' +
              '<label>To delete your post you must provide your private key. Please save this key, because otherwise you will not be able to delete it.</label>' +
              '<input type="text" value="' + response + '" class="name form-control" disabled />' +
              '</div>' +
              '</form>',
            buttons: {
              OK: function () {
                //close
              },
            },
            onContentReady: function () {
              // bind to events
              var jc = this;
              this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it
              });
            }
          });
        },
        error: function (err) {
          notyf.error('Error occurred');
        }
      });
    } else {
      notyf.error("You've already created a project.");
    }
  });
}