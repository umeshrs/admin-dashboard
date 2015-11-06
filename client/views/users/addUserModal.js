Template.addUserModal.onRendered(function () {
  Session.set("closeAddUserModal", "");
});

Template.addUserModal.helpers({
  closeModal: function () {
    return Session.get("closeAddUserModal");
  }
});

Template.addUserModal.events({
  'click #add-user-modal-btn': function () {
    var isValidInput, options;
    isValidInput = validateInput();
    if (isValidInput) {
      Session.set("closeAddUserModal", "modal");
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
      Meteor.call("addUser", options);
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
  'input #confirm-password, focusout #confirm-password': function () {
    validateConfirmPassword();
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

function validateConfirmPassword () {
  if ($("#confirm-password").val().length > 0) {
    $( $("#confirm-password")[0].parentNode ).removeClass("has-error");
    return true;
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