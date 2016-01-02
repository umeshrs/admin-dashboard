Meteor.methods({
  removeReward(rewardId) {
    let currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to remove a reward");
    }
    else {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        // remove reward if user is logged in and has a role of administrator
        return Rewards.remove(rewardId);
      }
      else {
        throw new Meteor.Error("not-authorized", "User not authorized to remove a reward");
      }
    }
  }
});
