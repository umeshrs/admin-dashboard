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
    })
  }
});
