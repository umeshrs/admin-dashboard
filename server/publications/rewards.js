Meteor.publish("rewards", function (skip, limit) {
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId);
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Rewards.find({}, {
        sort: { createdAt: 1 },
        skip: skip,
        limit: limit
      });
    } else {
      return Rewards.find({
        published: true,
        availableCount: { $gt: 0 }
      }, {
        sort: { points: 1 },
        skip: skip,
        limit: limit,
        fields: { availableCount: 0, claimCount: 0, published: 0, createdAt: 0 }
      });
    }
  } else {
    return [];
  }
});
