Template.header.events({
  'click #logout': function (event) {
    Meteor.logout(function (error) {
      if (error) {
        console.log("Error logging out: ", error);
      } else {
        Router.go('/');
      }
    });
  },
  'click .header .brand': function () {
    Router.go('/');
  }
});

Template.notificationDropdown.helpers({
  notifications: function () {
    return Meteor.user() ? Meteor.user().profile.notifications.reverse() : [];
  }
});
