Meteor.methods({
  markNotificationAsRead(notificationId) {
    if (! this.userId) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to mark a notification as read")
    } else {
      if (! notificationId) {
        throw new Meteor.Error("notification-id-empty", "Notification id cannot be empty");
      }

      // mark notification as read if user is logged in AND a notification id is passed as an argument
      let result = Meteor.users.update({ _id: this.userId, 'profile.notifications._id': notificationId }, {
        $set: { 'profile.notifications.$.read': true }
      });

      // result is 0 if no notification was marked as true i.e. wrong notification id
      if (! result) {
        throw new Meteor.Error("notification-not-found", "Notification with the given id does not exist");
      }

      return result;
    }
  }
});
