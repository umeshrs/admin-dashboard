Meteor.startup(function() {
  Meteor.publish("usersData", function () {
    var currentUser, userRole;

    if (this.userId) {
      currentUser = Meteor.users.findOne({ _id: this.userId }, { fields: { 'profile.role': 1 } });
      userRole = currentUser.profile && currentUser.profile.role;
      console.log(userRole);
      if (userRole === "administrator") {
        return Meteor.users.find({}, { fields: { 'emails': 1, createdAt: 1 } });
      } else {
        this.ready();
      }
    } else {
      this.ready();
    }
  });
});

Meteor.methods({
  addUser: function(options) {
    var user, userRole, newUserId;
    user = Meteor.user();
    userRole = user && user.profile && user.profile.role;

    if (userRole === "administrator") {
      newUserId = Accounts.createUser(options);
      if (newUserId) {
        console.log("New user added. User id: ", newUserId);
        return Meteor.users.findOne({ _id: newUserId }, { fields: { 'profile.name': 1 } }).profile.name;
      } else {
        console.log("Error adding new user to the database.");
      }
    } else {
      console.log("You do not have permission to add new users.");
    }
  }
});

Meteor.users.allow({
  remove: function (userId, doc) {
    var currentUser, userRole;
    currentUser = Meteor.users.findOne({ _id: userId }, { fields: { 'profile.role': 1 } });
    userRole = currentUser.profile && currentUser.profile.role;
    if (userId !== doc._id && userRole === "administrator") {
      console.log("Access granted. You are an administrator and you are not trying to delete your own document.");
      return true;
    } else {
      console.log("Access denied. You are not an administrator or you are trying to delete your own document.");
      return false;
    }
  },
  fetch: []
});
