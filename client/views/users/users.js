Meteor.subscribe("usersData");

Template.users.onRendered(function () {
  Session.setDefault("currentUser", {});
});

Template.users.helpers({
  users: function () {
    return Meteor.users.find({}, { sort: { createdAt: 1 } });
  }
});

Template.users.events({
  'click #remove-user-btn': function () {
    Session.set("currentUser", this);
  }
});
