Template.editReward.events({
  'submit #edit-reward-form': function (event, template) {
    event.preventDefault();

    let validTill = template.$(".date").datepicker('getDate');
    validTill = validTill && new Date( validTill.setHours(23, 59, 59, 999) );
    let reward = {
      title: template.$("#reward-title").val(),
      description: template.$("#reward-description").val().trim(),
      points: template.$("#reward-points").val() && +template.$("#reward-points").val(),
      availableCount: template.$("#quantity").val() && +template.$("#quantity").val(),
      validTill: validTill,
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
