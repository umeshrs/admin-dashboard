Template.viewRewards.onCreated(function () {
  let self = this;

  Session.setDefault("pageNumber", 1);
  Session.setDefault("recordsPerPage", 3);

  self.autorun(function () {
    Meteor.call("getRewardCount", function (error, result) {
      if (error) {
        console.log(`Error invoking method 'getRewardCount'. Error: ${error.message}`);
      } else {
        Session.set("numberOfPages", Math.ceil(result / Session.get("recordsPerPage")));
      }
    });

    let skip = (Session.get("pageNumber") - 1) * Session.get("recordsPerPage");
    if (skip < 0) {
      skip = 0;
      Session.set("pageNumber", 1);
    }
    let limit = Session.get("recordsPerPage");
    self.subscribe("rewards", skip, limit);
  });
});

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
