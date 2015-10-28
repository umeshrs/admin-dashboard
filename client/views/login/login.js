Template.login.events({
  'submit #login-form': function (event) {
    event.preventDefault();

    var username, password;
    username = $("#login-username").val();
    password = $("#login-password").val();
    Meteor.loginWithPassword(username, password, function (error) {
      console.log("error: ", error);
      if (Meteor.userId()) {
        console.log("Login successful");
        Router.go('/home');
      } else {
        console.log("Login unsuccessful. Please try again.");
      }
    });
  }
});