var rocketChatConnection, wekanConnection;
rocketChatConnection = DDP.connect("http://" + ROCKET_CHAT_DOMAIN + ":" + ROCKET_CHAT_PORT);
wekanConnection = DDP.connect("http://" + WEKAN_DOMAIN + ":" + WEKAN_PORT);

Template.removeUserModal.events({
  'click #remove-user-modal-btn': function () {

    Meteor.users.remove({ _id: Session.get("currentUser")._id }, function (error, result) {
      if (error) {
        console.log("Error removing document: ", error);
      } else {
        var options;
        options = {
          style: "bar",
          position: "top",
          message: Session.get("currentUser").profile.name + " has been removed from the database.",
          type: "info"
        }
        $('body').pgNotification(options).show();
        console.log(Session.get("currentUser").username + " removed from admin app instance. ");
      }
    });

    // console.log("rocketChatConnection status: ", rocketChatConnection.status());

    rocketChatConnection.call("getUserId", Session.get("currentUser").username, function (error, result) {
      if (error) {
        console.log("Error getting rocket chat userId: ", error);
      } else {
        rocketChatConnection.call("deleteUser", result, function (error, result) {
          if (error) {
            console.log("Error deleting user from rocket chat instance: ", error);
          } else {
            console.log(Session.get("currentUser").username + " removed from rocket chat instance.");
          }
        });
      }
    });

    // console.log("wekanConnection status: ", wekanConnection.status());

    wekanConnection.call("getUserId", Session.get("currentUser").username, function (error, result) {
      if (error) {
        console.log("Error getting wekan userId: ", error.reason);
      } else {
        wekanConnection.call("deleteUser", result, function (error, result) {
          if (error) {
            console.log("Error deleting user from wekan instance: ", error);
          } else {
            console.log(Session.get("currentUser").username + " removed from wekan instance.");
          }
        });
      }
    });
  }
});
