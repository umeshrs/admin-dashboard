Meteor.publish("rewardTitles", function () {
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId);
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Rewards.find({}, { fields: { title: 1 } });
    } else {
      return [];
    }
  } else {
    return [];
  }
});
