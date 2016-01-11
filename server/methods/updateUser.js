Meteor.methods({
  updateUser(userId, options) {
    let currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to update a user");
    }
    else {
      // update user only if current user is logged in and has a role of administrator
      if (currentUser.profile && currentUser.profile.role === "administrator") {

        if (options.username) {
          let result = Accounts.findUserByUsername(options.username);
          if (result) {
            if (result._id !== userId) {
            // username already exists
              throw new Meteor.Error("username-exists", "Username already exists");
            }
          } else {
            // No user exists with this username. Safe to update.
            Accounts.setUsername(userId, options.username);
          }
        } else {
          // username is empty
          throw new Meteor.Error("username-empty", "Username cannot be empty");
        }

        // set password if a new password has been entered
        if (options.password) {
          Accounts.setPassword(userId, options.password);
        }

        if (options.email) {
          let user = Meteor.users.findOne(userId);
          let emails = (user && user.emails) || [];

          // remove existing emails so that only one email is stored for each user
          emails.forEach(function (email) {
            Accounts.removeEmail(userId, email.address);
          });

          // add new email
          Accounts.addEmail(userId, options.email);
        }

        return Meteor.users.update(userId, {
          $set: {
            'profile.CIP': options.profile.CIP,
            'profile.title': options.profile.title,
            'profile.name': options.profile.name,
            'profile.pharmacyName': options.profile.pharmacyName,
            'profile.address': options.profile.address,
            'profile.telephone': options.profile.telephone,
            'profile.fax': options.profile.fax,
          }
        });
      } else {
        throw new Meteor.Error("not-authorized", "User not authorized to update a user");
      }
    }
  }
});
