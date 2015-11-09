var rocketChatConnection;
rocketChatConnection = DDP.connect('http://192.168.1.122:4000');

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
        console.log("Number of documents removed: " + result);
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
            console.log(Session.get("currentUser").username + " successfully removed from rocket chat instance.");
          }
        });
      }
    });

    // rocketChatConnection.disconnect();
  }
});
