Template.addSurvey.onRendered(function () {
  this.$("#form-title").focus();

  this.$('.date').datepicker({
    format: "dd/mm/yyyy",
    startDate: 'today',
    todayBtn: 'linked',
    autoclose: true,
  });
});

Template.addSurvey.events({
  'click #add-question-btn': function (event, template) {
    let parentNode = template.$(event.target).closest(".btns-wrapper").siblings(".questions-wrapper")[0];
    Blaze.render(Template.question, parentNode);
  },
  'click #save-survey-btn': function (event, template) {
    let survey = {};
    survey.title = template.$(event.target).closest("#add-survey-form").find("#form-title").val();
    survey.description = template.$(event.target).closest("#add-survey-form").find("#form-description").val();
    survey.questions = [];
    let questions = template.$(event.target).closest("#add-survey-form").find(".question-wrapper");

    for (let i = 0; i < questions.length; i++) {
      let question = {};
      question.text = template.$(questions[i]).find(".question").val();
      question.options = [];
      let options = template.$(questions[i]).find(".option");

      for (let j = 0; j < options.length; j++) {
        let option = {};
        option.text = template.$(options[j]).val();
        question.options.push(option);
      }

      survey.questions.push(question);
    }

    survey.published = false;
    survey.publishDate = template.$("#publish-date").closest(".date").datepicker('getDate');
    survey.expiryDate = template.$("#expiry-date").closest(".date").datepicker('getDate');
    survey.expiryDate.setHours(23);
    survey.expiryDate.setMinutes(59);
    survey.expiryDate.setSeconds(59);
    survey.createdAt = new Date();

    Meteor.call("insertSurvey", survey, function (error, result) {
      let notificationOptions = {
        style: "bar",
        position: "top",
        type: "error"
      };
      if (error) {
        console.log(`Error invoking method 'insertSurvey'. Error: ${error.message}`);
        switch (error.error) {
          case "not-logged-in":
            notificationOptions.message = "<b>Oops!</b> You must be logged in to add a survey.";
            break;
          case "not-authorized":
            notificationOptions.message = "<b>Oops!</b> You are not authorized to add a survey.";
            break;
          default:
            notificationOptions.message = "<b>Oops!</b> Something went wrong while adding the new survey. Please try again.";
            break;
        }
      } else {
        Router.go('/surveys');
        console.log(`New survey inserted into surveys collection. Result: ${result}`);
        notificationOptions.message = "<b>Success!</b> New survey added.";
        notificationOptions.type = "success";

        Meteor.call("pushNotifications", result);
      }
      $('body').pgNotification(notificationOptions).show();
    });
  },
  'click #cancel-btn': function () {
    Router.go('/surveys');
  },
  'focusin .form-control': function (event, template) {
    template.$(event.target).closest(".form-group-default").css({"padding-bottom": "9px", "border-bottom": "2px solid"});
  },
  'focusout .form-control': function (event, template) {
    template.$(event.target).closest(".form-group-default").css({"padding-bottom": "10px", "border-bottom": "1px inset"});
  }
});

Template.question.onRendered(function () {
  this.$(".question").focus();
});

Template.question.events({
  'click .add-option': function (event) {
    var placeholder = "Option " + $(event.target).closest(".options-wrapper")[0].childElementCount;
    var parentNode = $(event.target).closest(".options-wrapper")[0];
    var nextNode = $(event.target).closest(".options-wrapper > :last-child")[0];
    Blaze.renderWithData(Template.option, { placeholder: placeholder }, parentNode, nextNode);
  },
  'click .remove-question': function (event, template) {
    var questionNode = $(event.target.closest(".question-wrapper"));
    Blaze.remove(template.view);
    $(questionNode).remove();
  }
});

Template.option.events({
  'click .remove-option': function (event, template) {
    Blaze.remove(template.view);
    $(event.target).closest(".row").remove();
  }
});
