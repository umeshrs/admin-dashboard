Template.addReward.onRendered(function () {
  let template = this;

  Session.set("fieldRequired", false);

  template.$('.date').datepicker({
    format: "dd/mm/yyyy",
    startDate: 'today',
    todayBtn: 'linked',
    autoclose: true,
  });

  template.$("#add-reward-form").validate({
    rules: {
      "reward-title": {
        required: true,
        maxlength: 50
      },
      "reward-points": {
        digits: true,
        min: 1,
        max: 1000000
      },
      "quantity": {
        digits: true,
        min: 1,
        max: 1000000
      }
    }
  });

  template.autorun(function () {
    template.$("#reward-title").rules("add", {
      messages: {
        required: TAPi18n.__("REWARD_TITLE_EMPTY_ERROR"),
        maxlength: TAPi18n.__("REWARD_TITLE_MAX_LENGTH_ERROR")
      }
    });

    template.$("#reward-points").rules("add", {
      messages: {
        digits: TAPi18n.__("REWARD_POINTS_DIGITS_ERROR"),
        min: TAPi18n.__("REWARD_POINTS_MIN_ERROR"),
        max: TAPi18n.__("REWARD_POINTS_MAX_ERROR")
      }
    });

    template.$("#quantity").rules("add", {
      messages: {
        digits: TAPi18n.__("REWARD_QUANTITY_DIGITS_ERROR"),
        min: TAPi18n.__("REWARD_QUANTITY_MIN_ERROR"),
        max: TAPi18n.__("REWARD_QUANTITY_MAX_ERROR")
      }
    });

    if ( Session.get("fieldRequired") ) {
      template.$("#reward-points").rules("add", {
        required: true,
        messages: {
          required: TAPi18n.__("REWARD_POINTS_EMPTY_ERROR")
        }
      });

      template.$("#quantity").rules("add", {
        required: true,
        messages: {
          required: TAPi18n.__("REWARD_QUANTITY_EMPTY_ERROR")
        }
      });

      template.$("#valid-till").rules("add", {
        required: true,
        messages: {
          required: TAPi18n.__("REWARD_VALID_TILL_EMPTY_ERROR")
        }
      });
    } else {
      template.$("#reward-points").rules("remove", "required");
      template.$("#quantity").rules("remove", "required");
      template.$("#valid-till").rules("remove", "required");
    }
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
      availableCount: +template.$("#quantity").val(),
      claimCount: 0,
      validTill: new Date( template.$(".date").datepicker('getDate').setHours(23, 59, 59, 999) ),
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
