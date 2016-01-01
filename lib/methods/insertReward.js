Meteor.methods({
  insertReward(reward) {
    var currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to isnert a reward.");
    }
    else {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        // insert reward into rewards collection if user is logged in AND has a role of administrator
        return Rewards.insert(reward);
      }
      else {
        throw new Meteor.Error("not-authorized", "User not authorized to insert a reward.");
      }
    }
  }
});
