Template.addReward.onRendered(function () {
  Session.set("fieldRequired", false);

  this.$('.date').datepicker({
    format: "dd/mm/yyyy",
    startDate: 'today',
    todayBtn: 'linked',
    autoclose: true,
  });
});

Template.addReward.helpers({
  fieldRequired() {
    return Session.get("fieldRequired");
  }
});

Template.addReward.events({
  'submit #add-reward-form': function (event, template) {
    event.preventDefault();
    let reward = {
      title: template.$("#reward-title").val(),
      description: template.$("#reward-description").val(),
      points: +template.$("#reward-points").val(),
      availableCount: +template.$("#available-count").val(),
      claimCount: 0,
      validTill: template.$(".date").datepicker('getDate'),
      published: template.$(".switchery")[0].checked,
      createdAt: new Date()
    };

    Meteor.call('insertReward', reward, function (error, result) {
      let notificationOptions = {
        style: "bar",
        position: "top",
        type: "error"
      };
      if (error) {
        console.log(`Error invoking method 'insertReward'. Error: ${error.message}`);
        switch (error.error) {
          case "not-logged-in":
            notificationOptions.message = "<b>Oops!</b> You must be logged in to add a reward.";
            break;
          case "not-authorized":
            notificationOptions.message = "<b>Oops!</b> You are not authorized to add a reward.";
            break;
          default:
            notificationOptions.message = "<b>Oops!</b> Something went wrong while adding the new reward. Please try again.";
            break;
        }
      } else {
        Router.go('/rewards');
        console.log(`New reward inserted into rewards collection. Result: ${result}`);
        notificationOptions.message = "<b>Success!</b> New reward added.";
        notificationOptions.type = "success";
      }
      $('body').pgNotification(notificationOptions).show();
    });
  },
  'click #cancel-btn': function () {
    Router.go('/rewards');
  },
  'change .switchery': function (event) {
    this.checked = ! this.checked;
    Session.set("fieldRequired", this.checked);
  }
});
