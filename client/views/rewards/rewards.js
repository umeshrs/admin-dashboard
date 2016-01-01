Template.rewards.helpers({
  rewards() {
    return Rewards.find({}, { sort: { createdAt: 1} });
  }
});

Template.rewards.events({
  'click #add-reward-btn': function () {
    Router.go('/rewards/add-reward');
  }
});
