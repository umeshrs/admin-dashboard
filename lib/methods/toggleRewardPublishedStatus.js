Meteor.methods({
  toggleRewardPublishedStatus(rewardId, status) {
    return Rewards.update(rewardId, { $set: { published: status } });
  }
});
