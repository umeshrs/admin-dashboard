Template.removeMemberModal.events({
  'click #remove-member-modal-btn': function () {
    let user = Session.get("currentUser");

    Meteor.call("removeUser", user._id, user.username, function (error, result) {
      let notificationOptions = {
        style: "bar",
        position: "top",
        type: "error"
      };

      if (error) {
        console.log(`Error invoking method 'removeUser'. Error: ${error.message}.`);
        switch (error.error) {
          case "not-logged-in":
            notificationOptions.message = "<b>Oops!</b> You must be logged in to remove a member.";
            break;
          case "not-authorized":
            notificationOptions.message = "<b>Oops!</b> You are not authorized to remove a member.";
            break;
          default:
            notificationOptions.message = "<b>Oops!</b> Something went wrong while removing the member. Please try again.";
            break;
        }
      } else {
        console.log(`${result} document(s) removed from users collection. User removed: '${user.username}'.`);
        notificationOptions.message = `<b>Success!</b> ${user.profile && user.profile.name} has been removed.`;
        notificationOptions.type = "success";
      }

      $('body').pgNotification(notificationOptions).show();
    });
  }
});
