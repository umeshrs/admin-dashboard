Meteor.subscribe("usersData");

Template.members.onRendered(function () {
  Session.setDefault("currentUser", {});
  $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
  $('[data-tooltip-toggle="tooltip"]').tooltip({ container: 'body' });
});

Template.members.helpers({
  members: function () {
    return Meteor.users.find({ 'profile.role': "member" }, { sort: { createdAt: 1 } });
  }
});

Template.members.events({
  'click #add-member-btn': function () {
    Router.go('/members/add-member');
  },
  'click .remove-member-btn': function () {
    Session.set("currentUser", this);
  }
});
