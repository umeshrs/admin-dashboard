Session.setDefault("src", "");

Template.rocketChat.helpers({
  version: function () {
    Meteor.call("getVersion", function (error, result) {
      Session.set("version", result);
    });

    return Session.get("version");
  },
  src: function () {
    return localStorage.getItem("rocketChatSrc");
  },
  style: function () {
    if (localStorage.getItem("rocketChatSrc") !== "") {
      return "display: block;";
    }
    return "display: none;";
  }
});
