var rocketChatConnection, wekanConnection;
Meteor.startup(function () {
  rocketChatConnection = DDP.connect("http://" + ROCKET_CHAT_DOMAIN + ":" + ROCKET_CHAT_PORT);
  wekanConnection = DDP.connect("http://" + WEKAN_DOMAIN + ":" + WEKAN_PORT);
});

Meteor.methods({
  addDefaultUser: function (options) {
    var newUserId;
    newUserId = Accounts.createUser(options);

    rocketChatConnection.call("registerUser", {
      username: options.username,
      pass: options.password,
      email: options.email,
      name: options.profile.name
    }, function (error, result) {
      if (error) {
        console.log("Error creating default user in rocket chat instance. Error: ", error.message);
      } else {
        console.log(options.username + " added to rocket chat instance.");
      }
    });

    wekanConnection.call("addUser", {
      username: options.username,
      password: options.password,
      email: options.email,
      profile: { fullname: options.profile.name }
    }, function (error, result) {
      if (error) {
        console.log("Error creating default user in wekan instance. Error: ", error.message);
      } else {
        console.log(options.username + " added to wekan instance.");
      }
    });
  }
});
