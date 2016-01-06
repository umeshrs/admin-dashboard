Template.viewRewards.onRendered(function () {
  Tracker.autorun(function () {
    if (Rewards.find({ published: true }, {}).count() > 0) {
      $('[data-tooltip-toggle="tooltip"]').tooltip({ container: 'body', trigger: 'hover' });
    }
  });
});

Template.viewRewards.helpers({
  rewardPoints() {
    return (Meteor.user() && Meteor.user().profile && Meteor.user().profile.rewardPoints) || 0;
  },
  rewards() {
    return Rewards.find({ published: true, availableCount: { $gt: 0 } }, {
      fields: {
        title: 1,
        description: 1,
        validTill: 1,
        points: 1,
        createdAt: 1
      },
      sort: { createdAt: 1} });
  }
});

Template.viewRewards.events({
  'click .claim-reward-btn': function () {
    Session.set("currentReward", this);
  }
});
