Template.header.onRendered(function () {
  Session.set("showNotificationDropdown", false);
});

Template.header.helpers({
  unreadNotificationCount() {
    let notifications = (Meteor.user() && Meteor.user().profile && Meteor.user().profile.notifications) || [];
    let unreadCount = 0;
    notifications.forEach(function (notification) {
      if (! notification.read) {
        unreadCount++;
      }
    });
    return unreadCount;
  },
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

Template.notificationDropdown.onRendered(function () {
  let template = this;

  // initialise notification dropdown scrollbar
  template.$("[class*=scrollbar]").scrollbar();
});

Template.notificationDropdown.helpers({
  notifications: function () {
    return Meteor.user() ? ( Array.isArray(Meteor.user().profile.notifications) ? Meteor.user().profile.notifications.reverse() : [] ) : [];
  }
});

Template.notificationItem.onRendered(function () {
  this.$('[data-toggle="tooltip"]').tooltip({ container: 'body', trigger: 'hover' });
});

Template.notificationItem.helpers({
  getData() {
    return { _id: this.surveyId };
  },
  icon() {
    if (this.type === "survey") {
      return "file-text-o";
    }
  },
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

Template.notificationItem.events({
  'click .notification-item a': function (event, template) {
    template.$('[data-toggle="tooltip"]').tooltip('hide');
    Meteor.call("markNotificationAsRead", this._id, function (error, result) {
      if (error) {
        console.log(`Something went wrong while marking this notification as read. Error: ${error.message}.`);
      } else {
        console.log(`${result} notification marked as read.`);
      }
    });
  }
});
