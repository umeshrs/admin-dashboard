Meteor.methods({
  insertUser(options) {
    let currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to isnert a user");
    }
    else {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        // insert user into users collection if current user is logged in AND has a role of administrator
        return Accounts.createUser(options);
      }
      else {
        throw new Meteor.Error("not-authorized", "User not authorized to insert a user");
      }
    }
  }
});
