Meteor.publish("reward", function (rewardId) {
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId);
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Rewards.find(rewardId);
    } else {
      return [];
    }
  } else {
    return [];
  }
});
