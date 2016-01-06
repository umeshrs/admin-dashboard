Template.claimRewardModal.onRendered(function () {
  // remove class 'disable-scroll' from modal if its content height is greater than the window height
  $("#claim-reward-modal").on('shown.bs.modal', function (event) {
    if ($(event.target).find(".modal-content").innerHeight() > $(window).innerHeight()) {
      $(event.target).removeClass('disable-scroll');
    }
  });

  // add class 'disable-scroll' (default) to modal when a modal is closed
  $("#claim-reward-modal").on('hidden.bs.modal', function (event) {
    $(event.target).addClass('disable-scroll');
  });
});

Template.claimRewardModal.helpers({
  reward() {
    return Session.get("currentReward");
  }
});

Template.claimRewardModal.events({
  'click #claim-reward-modal-btn': function () {
    let userPoints = Meteor.user() && Meteor.user().profile && Meteor.user().profile.rewardPoints;
    let notificationOptions = {
      style: "bar",
      position: "top",
      type: "error"
    };

    if (userPoints && userPoints >= this.points) {
      Rewards.update(this._id, {
        $inc: {
          claimCount: 1,
          availableCount: -1
        }
      });
      Meteor.users.update(Meteor.userId(), {
        $set: { 'profile.rewardPoints': userPoints - this.points }
      });
      console.log(`Reward '${this.title}' has been claimed by ${Meteor.user().username}.`);
      notificationOptions.message = `<b>Success!</b> You have claimed the reward '${this.title}'.`;
      notificationOptions.type = "success";
    } else {
      console.log(`User does not have enough points to claim this reward.`);
      notificationOptions.message = "<b>Oops!</b> Looks like you don't have enough points to claim this reward. " +
        "Please choose another reward.";
    }
    $('body').pgNotification(notificationOptions).show();
  }
});
