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
  'change .switchery': function (event, template) {
    let self = this, reward = Template.currentData();
    Meteor.call("toggleRewardPublishedStatus", self.rewardId, self.checked, function (error, result) {
      let notificationOptions = {
        style: "bar",
        position: "top",
        type: "error"
      };
      if (error) {
        console.log(`Error invoking method 'toggleRewardPublishedStatus'. Error: ${error.message}.`);
        switch (error.error) {
          case "not-logged-in":
            notificationOptions.message = "<b>Oops!</b> You must be logged in to toggle reward publish status.";
            break;
          case "not-authorized":
            notificationOptions.message = "<b>Oops!</b> You are not authorized to toggle reward publish status.";
            break;
          case "required-values-missing":
            notificationOptions.message = "<b>Oops!</b> Some required values are missing to publish this reward. " +
              "Please enter the missing details and try again.";
            reward.switchery.setPosition(true);
            self.checked = reward.switchery.isChecked();
            break;
          default:
            notificationOptions.message = "<b>Oops!</b> Something went wrong while toggling this reward's publish " +
              "status. Please try again.";
            break;
        }
      } else {
        console.log(`Updated publish status of ${result} reward(s).`);
        notificationOptions.message = `<b>Success!</b> Reward '${reward.title}' has been ${reward.published ? 'unpublished' : 'published'}.`;
        notificationOptions.type = "success";
      }
      $('body').pgNotification(notificationOptions).show();
    });
  }
});
