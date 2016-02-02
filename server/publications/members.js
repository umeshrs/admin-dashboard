Meteor.publish("members", function () {
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId, { fields: { 'profile.role': 1 } });
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Meteor.users.find({ 'profile.role': "member" }, {
        fields: { services: 0 }
      });
    } else {
      return [];
    }
  } else {
    return [];
  }
});
