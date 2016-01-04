Template.editReward.events({
  'click #edit-reward-save-btn': function (event, template) {
    let reward = {
      title: template.$("#reward-title").val(),
      description: template.$("#reward-description").val(),
      points: template.$("#reward-points").val(),
      availableCount: template.$("#available-count").val(),
      validTill: template.$(".date").datepicker('getDate'),
      published: template.$(".switchery")[0].checked
    };

    Meteor.call('updateReward', this._id, reward, function (error, result) {
      let notificationOptions = {
        style: "bar",
        position: "top",
        type: "error"
      };
      if (error) {
        console.log(`Error invoking method 'updateReward'. Error: ${error.message}.`);
        switch (error.error) {
          case "not-logged-in":
            notificationOptions.message = "<b>Oops!</b> You must be logged in to edit a reward.";
            break;
          case "not-authorized":
            notificationOptions.message = "<b>Oops!</b> You are not authorized to edit a reward.";
            break;
          default:
            notificationOptions.message = "<b>Oops!</b> Something went wrong while editing the reward. Please try again.";
            break;
        }
      } else {
        Router.go('/rewards');
        console.log(`${result} reward(s) updated in rewards collection.`);
        notificationOptions.message = "<b>Success!</b> Changes made to the reward have been saved.";
        notificationOptions.type = "success";
      }
      $('body').pgNotification(notificationOptions).show();
    });
  }
});
