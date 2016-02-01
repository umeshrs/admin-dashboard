Template.removeRewardModal.events({
  'click #remove-reward-modal-btn': function () {
    let rewardId = Session.get("currentReward") && Session.get("currentReward")._id;
    Meteor.call("removeReward", rewardId, function (error, result) {
      let notificationOptions = {
        style: "bar",
        position: "top",
        type: "error"
      };
      if (error) {
        console.log(`Error invoking method 'removeReward'. Error: ${error.message}.`);
        switch (error.error) {
          case "not-logged-in":
            notificationOptions.message = "<b>Oops!</b> You must be logged in to remove a reward.";
            break;
          case "not-authorized":
            notificationOptions.message = "<b>Oops!</b> You are not authorized to remove a reward.";
            break;
          default:
            notificationOptions.message = "<b>Oops!</b> Something went wrong while removing the reward. Please try again.";
            break;
        }
      } else {
        console.log(`${result} reward(s) removed from rewards collection.`);
        notificationOptions.message = `<b>Success!</b> ${Session.get("currentReward") && Session.get("currentReward").title} has been removed.`;
        notificationOptions.type = "success";
      }
      $('body').pgNotification(notificationOptions).show();
    });
  }
});
