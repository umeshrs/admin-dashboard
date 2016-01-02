Template.rewards.onRendered(function () {
  Tracker.autorun(function () {
    if (Rewards.find({}, { sort: { createdAt: 1} }).count() > 0) {
      $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
      $('[data-tooltip-toggle="tooltip"]').tooltip({ container: 'body' });
    }
  });
});

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
