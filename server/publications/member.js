Meteor.publish("member", function (memberId) {
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId, { fields: { 'profile.role': 1 } });
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Meteor.users.find(memberId, {
        fields: { services: 0 }
      });
    } else {
      return [];
    }
  } else {
    return [];
  }
});
