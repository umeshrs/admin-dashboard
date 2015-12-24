Meteor.subscribe("usersData");

Template.users.onRendered(function () {
  Session.setDefault("currentUser", {});
  $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
  $('[data-tooltip-toggle="tooltip"]').tooltip({ container: 'body' });
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
