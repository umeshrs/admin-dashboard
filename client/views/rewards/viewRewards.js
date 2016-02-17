Template.viewRewards.onCreated(function () {
  let self = this;

  Session.setDefault("pageNumber", 1);
  Session.setDefault("recordsPerPage", 10);

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
  // explicitly add vertical scrollbar to the window
  $('body').css("overflow-y", "scroll");
});

Template.rewards.onDestroyed(function () {
  // clear pagination related Session values
  Session.delete("pageNumber");
  Session.delete("recordsPerPage");
  Session.delete("numberOfPages");

  // restore window scrollbar to its initial state
  $('body').css("overflow-y", "visible");
});

Template.viewRewards.helpers({
  rewardPoints() {
    return (Meteor.user() && Meteor.user().profile && Meteor.user().profile.rewardPoints) || 0;
  },
  rewards() {
    return Rewards.find({}, { sort: { points: 1 } });
  }
});

Template.rewardItem.onRendered(function () {
  let template = this;
  template.$('[data-tooltip-toggle="tooltip"]').tooltip({ container: 'body', trigger: 'hover' });
});

Template.rewardItem.events({
  'click .claim-reward-btn': function () {
    Session.set("currentReward", this);
  }
});
