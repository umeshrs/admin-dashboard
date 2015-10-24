Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Template.loginButtons.events({
  'click #login-buttons-password': function (event) {
    var username = $("#login-username").val();
    var password = $("#login-password").val();
    Meteor.call("getToken", username, password, function (error, result) {
      console.log("result: ", result);
      var domain, port, url;
      domain = "192.168.1.8";
      port = "4000";
      url = "http://" + domain + ":" + port + "?token=" + result.authToken;
      console.log(url);
      Session.set("src", url);
    });
  }
});
