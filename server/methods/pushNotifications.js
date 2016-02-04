Meteor.methods({
  pushNotifications: function (notification) {
    Meteor.users.update({ 'profile.role': "member" },
      { $push: { 'profile.notifications': notification } },
      { multi: true });
  }
});
