Template.login.events({
  'submit #login-form': function (event) {
    event.preventDefault();

    var username, password;
    username = $("#login-username").val();
    password = $("#login-password").val();
    Meteor.loginWithPassword(username, password, function (error) {
      console.log("Error logging in: ", error);
      if (Meteor.userId()) {
        console.log("Login successful");
        Meteor.call("getToken", username, password, function (error, result) {
          console.log("result: ", result);
          var domain, port, url;
          domain = "192.168.1.122";
          port = "4000";
          url = "http://" + domain + ":" + port + "?token=" + result.authToken;
          console.log(url);
          Session.set("src", url);
        });
        Router.go('/home');
      } else {
        console.log("Login unsuccessful. Please try again.");
      }
    });
  }
});