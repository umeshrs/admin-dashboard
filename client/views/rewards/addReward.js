Template.addReward.onRendered(function () {
  let template = this;

  Session.set("fieldRequired", template.data.published);

  template.$('.date').datepicker({
    format: "dd/mm/yyyy",
    startDate: 'today',
    todayBtn: 'linked',
    autoclose: true,
  });

  let validator = template.$("[id$='form']").validate({
    rules: {
      "reward-title": {
        required: true,
        maxlength: 50,
        rewardUnique: [true, template.data._id]
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
        maxlength: TAPi18n.__("REWARD_TITLE_MAX_LENGTH_ERROR"),
        rewardUnique: TAPi18n.__("REWARD_TITLE_UNIQUE_ERROR")
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
      // remove required rule for reward points, quantity and valid till if survey is not being published
      template.$("#reward-points").rules("remove", "required");
      template.$("#quantity").rules("remove", "required");
      template.$("#valid-till").rules("remove", "required");
    }

    // trigger validation in case rules were edited or site language was changed
    // and validation has been performed on that element at least once
    if ( template.$("#reward-title-error").length ) {
      validator.element("#reward-title");
    }
    if ( template.$("#reward-points-error").length ) {
      validator.element("#reward-points");
    }
    if ( template.$("#quantity-error").length ) {
      validator.element("#quantity");
    }
    if ( template.$("#valid-till-error").length ) {
      validator.element("#valid-till");
    }
  });

  // Subscribe to rewardTitles publication. Needed for rewardUnique validation rule.
  template.subscribe("rewardTitles");

  // bring focus to title input when template is rendered
  template.$("#reward-title").focus();
});

Template.addReward.helpers({
  fieldRequired() {
    return Session.get("fieldRequired");
  }
});

Template.addReward.events({
  'submit #add-reward-form': function (event, template) {
    event.preventDefault();
    let validTill = template.$(".date").datepicker('getDate');
    validTill = validTill && new Date( validTill.setHours(23, 59, 59, 999) );
    let reward = {
      title: template.$("#reward-title").val(),
      description: template.$("#reward-description").val().trim(),
      points: template.$("#reward-points").val() && +template.$("#reward-points").val(),
      availableCount: template.$("#quantity").val() && +template.$("#quantity").val(),
      claimCount: 0,
      validTill: validTill,
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
