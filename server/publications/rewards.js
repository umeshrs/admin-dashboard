Meteor.publish("rewards", function () {
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId);
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Rewards.find();
    } else {
      return Rewards.find({
        published: true,
        availableCount: { $gt: 0 }
      }, {
        fields: { availableCount: 0, claimCount: 0, published: 0, createdAt: 0 }
      });
    }
  } else {
    return [];
  }
});
