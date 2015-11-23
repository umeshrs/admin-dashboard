Meteor.methods({
  getUserCount: function () {
    return Meteor.users.find().fetch().length;
  }
});
