Template.login.events({
  'submit #login-form': function (event) {
    event.preventDefault();
    var username, password, domain, port, url;

    if (isValidInput()) {
      username = $("#login-username").val();
      password = $("#login-password").val();
      Meteor.loginWithPassword(username, password, function (error) {
        if (error) {
          if (error.reason === "User not found") {
            $( $("#login-username")[0].parentNode ).addClass("has-error");
            $( $("#login-username")[0].parentNode ).after('<p id="username-error" class="error login-error" for="username">Sorry, we do not recognise that username.</p>');
          } else if (error.reason === "Incorrect password") {
            $( $("#login-password")[0].parentNode ).addClass("has-error");
            $( $("#login-password")[0].parentNode ).after('<p id="password-error" class="error login-error" for="password">Incorrect password.</p>');
          } else {
            console.log("Error logging in: ", error);
          }
        }
        else {
          console.log("Login successful");
          Meteor.call("getToken", username, password, function (error, result) {
            if (error) {
              console.log("Error conencting to rocket chat server: ", error);
              console.log("Please check if the rocket chat server is running correctly.");
            } else {
              console.log("result: ", result);
              domain = "192.168.1.122";
              port = "4000";
              url = "http://" + domain + ":" + port + "?token=" + result.authToken;
              console.log(url);
              Session.set("src", url);
            }
          });
          Router.go('/home');
        }
      });
    }
  },
  'focusin .form-group-default': function (event) {
    $(event.currentTarget).addClass("focused");
  },
  'focusout .form-group-default': function (event) {
    $(event.currentTarget).removeClass("focused");
  },
  'input #login-username, focusout #login-username': function (event) {
    validateUsername();
  },
  'input #login-password, focusout #login-password': function (event) {
    validatePassword();
  }
});

function validateUsername() {
  if ($("#login-username").val().length > 0) {
    $( $("#login-username")[0].parentNode ).removeClass("has-error");
    $("#username-error").remove();
    return true;
  } else {
    $( $("#login-username")[0].parentNode ).addClass("has-error");
    if ($("#username-error.login-error").length > 0) {
      $("#username-error").remove();
    }
    if (! $("#username-error").length > 0) {
      $( $("#login-username")[0].parentNode ).after('<p id="username-error" class="error" for="username">Please enter your username.</p>');
    }
    return false;
  }
}

function validatePassword() {
  if ($("#login-password").val().length > 0) {
    $( $("#login-password")[0].parentNode ).removeClass("has-error");
    $("#password-error").remove();
    return true;
  } else {
    $( $("#login-password")[0].parentNode ).addClass("has-error");
    if ($("#password-error.login-error").length > 0) {
      $("#password-error").remove();
    }
    if (! $("#password-error").length > 0) {
      $( $("#login-password")[0].parentNode ).after('<p id="password-error" class="error" for="password">Please enter your password.</p>');
    }
    return false;
  }
}

function isValidInput() {
  var isValidUsername, isValidPassword;

  isValidUsername = validateUsername();
  isValidPassword = validatePassword();

  if (isValidUsername && isValidPassword) {
    return true;
  }

  return false;
}
