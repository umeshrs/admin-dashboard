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
        // 3rd party app token stored in localStorage
        localStorage.removeItem("rocketChatSrc");
        localStorage.removeItem("wekanSrc");
        localStorage.removeItem("reactionSrc");
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

Template.notificationItem.helpers({
  age: function () {
    var timeDiff = (Date.now() - this.createdAt) / (1000);
    if (timeDiff < 60) {
      return "< 1m ago";
    } else {
      timeDiff = timeDiff / 60;
      if (timeDiff < 60) {
        return Math.floor(timeDiff) + " m ago";
      } else {
        timeDiff = timeDiff / 60;
        if (timeDiff < 24) {
          return Math.floor(timeDiff) + " h ago";
        } else {
          timeDiff = timeDiff / 24;
          return Math.floor(timeDiff) + " d ago";
        }
      }
    }
  }
});
