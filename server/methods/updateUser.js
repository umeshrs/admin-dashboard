var rocketChatConnection, wekanConnection, reactionConnection;

Meteor.startup(function () {
  rocketChatConnection = DDP.connect("http://" + ROCKET_CHAT_DOMAIN + ":" + ROCKET_CHAT_PORT);
  wekanConnection = DDP.connect("http://" + WEKAN_DOMAIN + ":" + WEKAN_PORT);
  reactionConnection = DDP.connect("http://" + REACTION_DOMAIN + ":" + REACTION_PORT);
});

Meteor.methods({
  updateUser(userId, username, options) {
    let currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to update a user");
    }
    else {
      // update user only if current user is logged in and has a role of administrator
      if (currentUser.profile && currentUser.profile.role === "administrator") {

        let user = Meteor.users.findOne(userId);
        let usernameChanged = (options.username !== user.username) ? true : false;
        let passwordChanged = (options.password) ? true : false;
        let emailChanged = (options.email !== (user.emails && user.emails[0] && user.emails[0].address)) ? true : false;

        if (usernameChanged || passwordChanged || emailChanged) {
          if (! rocketChatConnection.status().connected) {
            throw new Meteor.Error("rocket-chat-down", "Not connected to rocket chat server");
          } else if (! wekanConnection.status().connected) {
            throw new Meteor.Error("wekan-down", "Not connected to wekan server");
          } else if (! reactionConnection.status().connected) {
            throw new Meteor.Error("reaciton-down", "Not connected to wekan server");
          } else {

            rocketChatConnection.call("getUserId", username, function (error, result) {
              if (error) {
                console.log(`Error invoking rocket chat method 'getUserId'. Error: ${error.message}.`);
              } else {
                rocketChatConnection.call("editUser", result, {
                  username: options.username,
                  password: options.password,
                  email: options.email
                }, function (error, result) {
                  if (error) {
                    console.log(`Error invoking rocket chat method 'editUser'. Error: ${error.message}.`);
                  } else {
                    console.log(`User document edited in rocket chat instance. Result: ${result}.`);
                  }
                });
              }
            });

            wekanConnection.call("getUserId", username, function (error, result) {
              if (error) {
                console.log(`Error invoking wekan method 'getUserId'. Error: ${error.message}.`);
              } else {
                wekanConnection.call("editUser", result, {
                  username: options.username,
                  password: options.password,
                  email: options.email
                }, function (error, result) {
                  if (error) {
                    console.log(`Error invoking wekan method 'editUser'. Error: ${error.message}.`);
                  } else {
                    console.log(`User document edited in wekan instance. Result: ${result}.`);
                  }
                });
              }
            });

            reactionConnection.call("getUserId", username, function (error, result) {
              if (error) {
                console.log(`Error invoking reaction method 'getUserId'. Error: ${error.message}.`);
              } else {
                reactionConnection.call("editUser", result, {
                  username: options.username,
                  password: options.password,
                  email: options.email
                }, function (error, result) {
                  if (error) {
                    console.log(`Error invoking reaction method 'editUser'. Error: ${error.message}.`);
                  } else {
                    console.log(`User document edited in reaction instance. Result: ${result}.`);
                  }
                });
              }
            });

            // update username
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

            // update password
            if (options.password) {
              Accounts.setPassword(userId, options.password);
            }

            // update email
            if (options.email) {
              let emails = (user && user.emails) || [];

              // remove existing emails so that only one email is stored for each user
              emails.forEach(function (email) {
                Accounts.removeEmail(userId, email.address);
              });

              // add new email
              Accounts.addEmail(userId, options.email);
            }
          }
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
