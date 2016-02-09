Meteor.methods({
  removeExpiredTasks() {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    Meteor.users.update({
      'profile.role': "member",
    }, {
      $pull: { 'profile.tasks': { expiryDate: { $lt: currentDate } } }
    }, {
      multi: true
    });
  }
});
