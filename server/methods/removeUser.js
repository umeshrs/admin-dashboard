var rocketChatConnection, wekanConnection, reactionConnection;

Meteor.startup(function () {
  rocketChatConnection = DDP.connect("http://" + ROCKET_CHAT_DOMAIN + ":" + ROCKET_CHAT_PORT);
  wekanConnection = DDP.connect("http://" + WEKAN_DOMAIN + ":" + WEKAN_PORT);
  reactionConnection = DDP.connect("http://" + REACTION_DOMAIN + ":" + REACTION_PORT);
});

Meteor.methods({
  removeUser(userId, username) {
    let currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to remove a user");
    }
    else {
      if (currentUser.profile && currentUser.profile.role === "administrator") {

        if (! rocketChatConnection.status().connected) {
          throw new Meteor.Error("rocket-chat-down", "Not connected to rocket chat server");
        } else if (! wekanConnection.status().connected) {
          throw new Meteor.Error("wekan-down", "Not connected to wekan server");
        } else if (! reactionConnection.status().connected) {
          throw new Meteor.Error("reaciton-down", "Not connected to wekan server");
        } else {
          // remove user only if current user is logged in AND has a role of administrator
          // AND connections to 3rd party apps (rocket chat and wekan at the moment) are active

          rocketChatConnection.call("getUserId", username, function (error, result) {
            if (error) {
              console.log(`Error invoking rocket chat method 'getUserId'. Error: ${error.message}`);
            } else {
              rocketChatConnection.call("deleteUser", result, function (error, result) {
                if (error) {
                  console.log(`Error invoking rocket chat method 'deleteUser'. Error: ${error.message}`);
                } else {
                  console.log(`${username} removed from rocket chat instance.`);
                }
              });
            }
          });

          wekanConnection.call("getUserId", username, function (error, result) {
            if (error) {
              console.log(`Error invoking wekan method 'getUserId'. Error: ${error.message}.`);
            } else {
              wekanConnection.call("deleteUser", result, function (error, result) {
                if (error) {
                  console.log(`Error invoking wekan method 'deleteUser'. Error: ${error.message}.`);
                } else {
                  console.log(`${username} removed from wekan instance.`);
                }
              });
            }
          });

          reactionConnection.call("getUserId", username, function (error, result) {
            if (error) {
              console.log(`Error invoking reaction method 'getUserId'. Error: ${error.message}.`);
            } else {
              reactionConnection.call("deleteUser", result, function (error, result) {
                if (error) {
                  console.log(`Error invoking reaction method 'deleteUser'. Error: ${error.message}.`);
                } else {
                  console.log(`${username} removed from reaction instance.`);
                }
              });
            }
          });

          return Meteor.users.remove(userId);
        }

      } else {
        throw new Meteor.Error("not-authorized", "User not authorized to remove a user");
      }
    }
  }
});
