Meteor.publish("cipValues", function () {
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId);
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Meteor.users.find({}, { fields: { 'profile.CIP': 1 } });
    } else {
      return [];
    }
  } else {
    return [];
  }
});
