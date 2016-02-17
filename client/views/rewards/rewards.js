Template.rewards.onCreated(function () {
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

Template.rewards.onRendered(function () {
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

Template.reward.onRendered(function () {
  let template = this;
  template.$('[data-toggle="tooltip"]').tooltip({ container: 'body' });
  template.$('[data-tooltip-toggle="tooltip"]').tooltip({ container: 'body', trigger: 'hover' });
});

Template.reward.events({
  'click .edit-reward-btn': function (event, template) {
    template.$('[data-toggle="tooltip"]').tooltip('hide');
    Router.go(`/rewards/edit-reward/${this._id}`);
  },
  'click .remove-reward-btn': function (event, template) {
    template.$('[data-tooltip-toggle="tooltip"]').tooltip('hide');
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
