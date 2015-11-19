var rocketChatConnection, wekanConnection, reactionConnection;
rocketChatConnection = DDP.connect("http://" + ROCKET_CHAT_DOMAIN + ":" + ROCKET_CHAT_PORT);
wekanConnection = DDP.connect("http://" + WEKAN_DOMAIN + ":" + WEKAN_PORT);
reactionConnection = DDP.connect("http://" + REACTION_DOMAIN + ":" + REACTION_PORT);

Template.addUserModal.events({
  'click #add-user-modal-btn': function () {
    var isValidInput, options, notificationOptions;
    isValidInput = validateInput();

    if (isValidInput) {
      options = {
        username: $("#username").val(),
        password: Accounts._hashPassword($("#password").val()),
        email: $("#email").val(),
        profile: {
          name: $("#first-name").val() + " " + $("#last-name").val(),
          role: $("#role").val(),
          pharmacy: {
            name: $("#pharmacy-name").val()
          }
        }
      };

      Meteor.call("addUser", options, function (error, result) {
        if (error) {
          console.log("Error adding new user: ", error);
        } else {
          notificationOptions = {
            style: "bar",
            position: "top",
            message: result + " has been add to the database.",
            type: "success"
          }
          $('body').pgNotification(notificationOptions).show();

          console.log(options.username + " added to admin app instance.");
        }
      });

      rocketChatConnection.call("registerUser", {
        username: options.username,
        pass: options.password,
        email: options.email,
        name: options.profile.name
      }, function (error, result) {
        if (error) {
          console.log("Error creating new user in rocket chat instance: ", error);
        } else {
          console.log(options.username + " added to rocket chat instance.");
        }
      });

      wekanConnection.call("addUser", {
        username: options.username,
        password: options.password,
        email: options.email,
        profile: { fullname: options.profile.name }
      }, function (error, result) {
        if (error) {
          console.log("Error creating new user in wekan instance: ", error);
        } else {
          console.log(options.username + " added to wekan instance.");
        }
      });

      reactionConnection.call("addUser", {
        username: options.username,
        password: options.password,
        email: options.email,
      }, function (error, result) {
        if (error) {
          console.log("Error creating new user in reaction instance: ", error);
        } else {
          console.log(options.username + " added to reaction instance.");
        }
      });

      $("#add-user-modal").hide();  // close the modal if all input field values are valid
    } else {
      $("#add-user-form").before('<p id="add-user-form-error" class="error" for="first-name">Please fill in all the required fields.</p>');
    }
  },
  'focusin .form-group-default': function (event) {
    $(event.currentTarget).addClass("focused");
  },
  'focusout .form-group-default': function (event) {
    $(event.currentTarget).removeClass("focused");
  },
  'input #first-name, focusout #first-name': function () {
    validateFirstName();
  },
  'input #last-name, focusout #last-name': function () {
    validateLastName();
  },
  'input #email, focusout #email': function () {
    validateEmail();
  },
  'input #username, focusout #username': function () {
    validateUsername();
  },
  'input #password, focusout #password': function () {
    validatePassword();
  },
  'input #confirm-password, focusout #confirm-password': function (event) {
    validateConfirmPassword(event);
  }
});

function validateFirstName () {
  if ($("#first-name").val().length > 0) {
    $( $("#first-name")[0].parentNode ).removeClass("has-error");
    $("#add-user-form-error").remove();
    return true;
  } else {
    $( $("#first-name")[0].parentNode ).addClass("has-error");
    return false;
  }
}

function validateLastName () {
  if ($("#last-name").val().length > 0) {
    $( $("#last-name")[0].parentNode ).removeClass("has-error");
    return true;
  } else {
    $( $("#last-name")[0].parentNode ).addClass("has-error");
    return false;
  }
}

function validateEmail () {
  if ($("#email").val().length > 0) {
    $( $("#email")[0].parentNode ).removeClass("has-error");
    return true;
  } else {
    $( $("#email")[0].parentNode ).addClass("has-error");
    return false;
  }
}

function validateUsername () {
  if ($("#username").val().length > 0) {
    $( $("#username")[0].parentNode ).removeClass("has-error");
    return true;
  } else {
    $( $("#username")[0].parentNode ).addClass("has-error");
    return false;
  }
}

function validatePassword () {
  if ($("#password").val().length > 0) {
    $( $("#password")[0].parentNode ).removeClass("has-error");
    return true;
  } else {
    $( $("#password")[0].parentNode ).addClass("has-error");
    return false;
  }
}

function validateConfirmPassword (event) {
  if ($("#confirm-password").val().length > 0) {
    if ((event && event.type) !== "input" && ( $("#confirm-password").val() !== $("#password").val() )) {
      $( $("#confirm-password")[0].parentNode ).addClass("has-error");
      if (! $("#add-user-form-error.password-error").length > 0){
        $("#add-user-form").before('<p id="add-user-form-error" class="error password-error" for="password">Entered passwords do not match.</p>');
      }
      return false;
    } else {
      $( $("#confirm-password")[0].parentNode ).removeClass("has-error");
      $("#add-user-form-error.password-error").remove();
      return true;
    }
  } else {
    $( $("#confirm-password")[0].parentNode ).addClass("has-error");
    return false;
  }
}

function validateInput () {
  var isValidFirstName, isValidLastName, isValidEmail, isValidUsername, isValidPassword, isValidConfirmPassword;

  isValidFirstName = validateFirstName();
  if (! isValidFirstName) {
    return false;
  }

  isValidLastName = validateLastName();
  if (! isValidLastName) {
    return false;
  }

  isValidEmail = validateEmail();
  if (! isValidEmail) {
    return false;
  }

  isValidUsername = validateUsername();
  if (! isValidUsername) {
    return false;
  }

  isValidPassword = validatePassword();
  if (! isValidPassword) {
    return false;
  }

  isValidConfirmPassword = validateConfirmPassword();
  if (! isValidConfirmPassword) {
    return false;
  }

  return true;
}