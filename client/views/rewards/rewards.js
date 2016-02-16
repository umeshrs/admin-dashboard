Template.rewards.onCreated(function () {
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

Template.rewards.onRendered(function () {
  Tracker.autorun(function () {
    if (Rewards.find({}, { sort: { createdAt: 1} }).count() > 0) {
      $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
      $('[data-tooltip-toggle="tooltip"]').tooltip({ container: 'body', trigger: 'hover' });
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
  },
  'click .edit-reward-btn': function () {
    $('[data-toggle="tooltip"]').tooltip('hide');
    $('[data-tooltip-toggle="tooltip"]').tooltip('hide');
    Router.go(`/rewards/edit-reward/${this._id}`);
  },
  'click .remove-reward-btn': function () {
    $('[data-toggle="tooltip"]').tooltip('hide');
    $('[data-tooltip-toggle="tooltip"]').tooltip('hide');
    Session.set("currentReward", this);
  },
  'change .switchery': function () {
    Meteor.call("toggleRewardPublishedStatus", this.rewardId, ! this.checked, function (error, result) {
      if (error) {
        console.log(`Error invoking method 'toggleRewardPublishedStatus'. Error: ${error.message}.`);
      } else {
        console.log(`Updated publish status of ${result} reward(s).`);
      }
    });
  }
});
