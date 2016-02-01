Template.viewRewards.onRendered(function () {
  Tracker.autorun(function () {
    if (Rewards.find().count() > 0) {
      $('[data-tooltip-toggle="tooltip"]').tooltip({ container: 'body', trigger: 'hover' });
    }
  });
});

Template.viewRewards.helpers({
  rewardPoints() {
    return (Meteor.user() && Meteor.user().profile && Meteor.user().profile.rewardPoints) || 0;
  },
  rewards() {
    return Rewards.find({}, { sort: { points: 1 } });
  }
});

Template.viewRewards.events({
  'click .claim-reward-btn': function () {
    Session.set("currentReward", this);
  }
});
