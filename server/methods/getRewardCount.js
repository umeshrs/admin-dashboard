Meteor.methods({
  getRewardCount() {
    let currentUser = Meteor.users.findOne(this.userId);
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Rewards.find({}, { fields: { _id: 1 } }).count();
    } else {
      return Rewards.find({ published: true, availableCount: { $gt: 0 } }, { fields: { _id: 1 } }).count();
    }
  }
});
