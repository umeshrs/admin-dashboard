Session.set("src", "");

Template.rocketChat.helpers({
  version: function () {
    Meteor.call("getVersion", function (error, result) {
      Session.set("version", result);
    });

    return Session.get("version");
  },
  src: function () {
    return Session.get("src");
  },
  style: function () {
    if (Session.get("src") !== "") {
      return "display: block;";
    }
    return "display: none;";
  }
});

Template.rocketChat.events({
  'click #login-btn': function (event) {
    console.log("Login button");
    var domain, port;
    domain = "192.168.1.8";
    port = "4000";

    HTTP.post("http://" + domain + ":" + port + "/api/login",
      {
        data: {
          password: "umesh",
          user: "umesh"
        }
      }, function (error, result) {
        if (error) {
          console.log(error);
        }
        console.log(result);
        var url = "http://" + domain + ":" + port + "?token=" + result.data.data.authToken;
        console.log(url);
        Session.set("src", url);
    });
  }
});
