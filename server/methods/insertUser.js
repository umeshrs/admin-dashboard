var rocketChatConnection, wekanConnection, reactionConnection;

Meteor.startup(function () {
  rocketChatConnection = DDP.connect("http://" + ROCKET_CHAT_DOMAIN + ":" + ROCKET_CHAT_PORT);
  wekanConnection = DDP.connect("http://" + WEKAN_DOMAIN + ":" + WEKAN_PORT);
  reactionConnection = DDP.connect("http://" + REACTION_DOMAIN + ":" + REACTION_PORT);
});

Meteor.methods({
  insertUser(options) {
    let currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to isnert a user");
    }
    else {
      if (currentUser.profile && currentUser.profile.role === "administrator") {

        if (! rocketChatConnection.status().connected) {
          throw new Meteor.Error("rocket-chat-down", "Not connected to rocket chat server");
        } else if (! wekanConnection.status().connected) {
          throw new Meteor.Error("wekan-down", "Not connected to wekan server");
        } else if (! reactionConnection.status().connected) {
          throw new Meteor.Error("reaction-down", "Not connected to reaction commerce server");
        } else {
          // insert user into users collection if current user is logged in AND has a role of administrator
          // AND connections to 3rd party apps are active

          rocketChatConnection.call("registerUser", {
            username: options.username,
            pass: options.password,
            email: options.email,
            name: options.profile.name
          }, function (error, result) {
            if (error) {
              console.log(`Error creating new user in rocket chat instance: ${error.message}`);
            } else {
              console.log(`${options.username} added to rocket chat instance.`);
            }
          });

          wekanConnection.call("addUser", {
            username: options.username,
            password: options.password,
            email: options.email,
            profile: { fullname: options.profile.name }
          }, function (error, result) {
            if (error) {
              console.log(`Error creating new user in wekan instance: ${error.message}`);
            } else {
              console.log(`${options.username} added to wekan instance.`);
            }
          });

          reactionConnection.call("addUser", {
            username: options.username,
            password: options.password,
            email: options.email,
          }, function (error, result) {
            if (error) {
              console.log(`Error creating new user in reaction instance: ${error.message}`);
            } else {
              console.log(`${options.username} added to reaction instance.`);
            }
          });

          return Accounts.createUser(options);
        }
      }
      else {
        throw new Meteor.Error("not-authorized", "User not authorized to insert a user");
      }
    }
  }
});
