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
