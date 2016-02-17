Template.claimRewardModal.onRendered(function () {
  let template = this;
  template.$('#claim-reward-modal').on('show.bs.modal', function (event) {
    // add negative margin-right to body to compensate for the padding-right added by bootstrap modal
    $("body").css("margin-right", "-15px");
  });

  template.$("#claim-reward-modal").on('shown.bs.modal', function (event) {
    if ($(event.target).find(".modal-content").innerHeight() > $(window).innerHeight()) {
      // enable modal scrollbar if its content height is greater than the window height
      $(event.target).removeClass('disable-scroll');

      // disable window vertical scrollbar if modal scrollbar is visible
      $("body").css("overflow-y", "hidden");

      // remove margin-right if modal scrollbar is enabled
      $("body").css("margin-right", "0px");
    }
  });

  template.$("#claim-reward-modal").on('hidden.bs.modal', function (event) {
    // add class 'disable-scroll' (default) to modal when a modal is closed
    $(event.target).addClass('disable-scroll');

    // enable window scroll bar in case it was disabled during shown.bs.modal
    $("body").css("overflow-y", "visible");

    // remove negative margin-right from body to compensate for the padding-right removed by bootstrap modal
    $("body").css("margin-right", "0px");
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
