Meteor.methods({
  toggleRewardPublishedStatus(rewardId, status) {
    let currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to toggle reward's publish status");
    }
    else {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        if (status === true) {
          let reward = Rewards.findOne(rewardId) || {};

          // check if all requierd information is avaialbe before publishing a reward
          if (!reward.title || !reward.points || !reward.availableCount || !reward.validTill) {
            throw new Meteor.Error("required-values-missing", "Some required values to publish the reward are missing");
          }
        }

        // toggle reward publish status if user is logged in AND has a role of administrator
        return Rewards.update(rewardId, { $set: { published: status } });
      }
      else {
        throw new Meteor.Error("not-authorized", "User not authorized to insert a reward.");
      }
    }
  }
});
