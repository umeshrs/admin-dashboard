Meteor.methods({
  updateReward(rewardId, reward) {
    if (! rewardId) {
      throw new Meteor.Error("rewardId", "Reward id cannot be empty");
    }

    let currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to update a reward");
    }
    else {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        // update reward only if user is logged in and has a role of administrator
        return Rewards.update(rewardId, {
          $set: {
            title: reward.title,
            description: reward.description,
            points: reward.points,
            availableCount: reward.availableCount,
            validTill: reward.validTill,
            published :reward.published
          }
        });
      }
      else {
        throw new Meteor.Error("not-authorized", "User not authorized to update a reward");
      }
    }
  }
});
