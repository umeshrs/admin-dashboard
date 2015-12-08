Template.header.onRendered(function () {
  Session.set("showNotificationDropdown", false);
});

Template.header.helpers({
  showNotificationDropdown: function () {
    return Session.get("showNotificationDropdown");
  }
});

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
  },
  'click #notification-center': function (event, template) {
    event.preventDefault();
    if (template.$(event.target).closest(".dropdown").hasClass("open")) {
      Session.set("showNotificationDropdown", false);
    } else {
      Session.set("showNotificationDropdown", true);
    }
  }
});

Template.notificationDropdown.helpers({
  notifications: function () {
    return Meteor.user() ? Meteor.user().profile.notifications.reverse() : [];
  }
});
