Meteor.publish("members", function (skip, limit) {
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId, { fields: { 'profile.role': 1 } });
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Meteor.users.find({ 'profile.role': "member" }, {
        sort: { createdAt: 1 },
        skip: skip,
        limit: limit,
        fields: { services: 0 }
      });
    } else {
      return [];
    }
  } else {
    return [];
  }
});
