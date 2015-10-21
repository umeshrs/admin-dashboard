Template.rocketChat.helpers({
  version: function () {
    Meteor.call("getVersion", function (error, result) {
      Session.set("version", result);
    });

    return Session.get("version");
  }
});
