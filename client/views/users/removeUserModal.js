Template.removeUserModal.events({
  'click #remove-user-modal-btn': function () {
    Meteor.users.remove({ _id: Session.get("currentUser")._id }, function (error, result) {
      if (error) {
        console.log("Error removing document: ", error);
      } else {
        console.log("Number of documents removed: " + result);
      }
    })
  }
});
