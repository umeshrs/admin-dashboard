var wekanConnection = DDP.connect("http://" + WEKAN_DOMAIN + ":" + WEKAN_PORT);
var reactionConnection = DDP.connect("http://" + REACTION_DOMAIN + ":" + REACTION_PORT);

Template.login.events({
  'submit #login-form': function (event) {
    event.preventDefault();
    var username, password, url;

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
              console.log("Logged in to rocket chat. Token: ", result.authToken);
              url = "http://" + ROCKET_CHAT_DOMAIN + ":" + ROCKET_CHAT_PORT + "?token=" + result.authToken;
              localStorage.setItem("rocketChatSrc", url);
            }
          });

          DDP.loginWithPassword(wekanConnection, {username: username}, password, function (error, result) {
            if (error) {
              console.log("Error logging in to wekan. Error: ", error.message);
              console.log("Please check if the wekan server is running correctly.");
            }
            else {
              console.log("Logged in to wekan. Token: ", result.token);
              url = "http://" + WEKAN_DOMAIN + ":" + WEKAN_PORT + "?token=" + (result && result.token);
              localStorage.setItem("wekanSrc", url);
            }
          });

          DDP.loginWithPassword(reactionConnection, {username: username}, password, function (error, result) {
            if (error) {
              console.log("Error logging in to reaction. Error: ", error.message);
              console.log("Please check if the reaction server is running correctly.");
            }
            else {
              console.log("Logged in to reaction. Token: ", result.token);
              url = "http://" + REACTION_DOMAIN + ":" + REACTION_PORT + "?token=" + (result && result.token);
              localStorage.setItem("reactionSrc", url);
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

Template.login.onRendered(function () {
  $("#login-username").focus();
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
