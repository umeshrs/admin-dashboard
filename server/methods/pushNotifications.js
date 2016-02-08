Meteor.methods({
  pushNotifications: function (notification) {
    console.log(`Pushing notification for ${notification.title}...`);
    Meteor.users.update({ 'profile.role': "member" },
      { $push: { 'profile.notifications': notification } },
      { multi: true });
  }
});
