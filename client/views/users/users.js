Template.users.onRendered(function () {
  Session.setDefault("currentUser", {});
});

Template.users.helpers({
  users: function () {
    return Meteor.users.find({}, { sort: { createdAt: 1 } });
  }
});

Template.users.events({
  'click #remove-user-btn': function () {
    Session.set("currentUser", this);
  },
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
