Template.editSurvey.onRendered(function () {
  this.$("#form-title").focus();

  this.$('.date').datepicker({
    format: "dd/mm/yyyy",
    startDate: 'today',
    todayBtn: 'linked',
    autoclose: true,
  });
});

Template.editSurvey.events({
  'focusin .form-control': function (event, template) {
    template.$(event.target).closest(".form-group-default").css({"padding-bottom": "9px", "border-bottom": "2px solid"});
  },
  'focusout .form-control': function (event, template) {
    template.$(event.target).closest(".form-group-default").css({"padding-bottom": "10px", "border-bottom": "1px inset"});
  },
  'click #add-question-btn': function (event) {
    var parentNode = $(event.target).closest(".btns-wrapper").siblings(".questions-wrapper")[0];
    Blaze.render(Template.question, parentNode);
  },
  'click #save-survey-btn': function (event, template) {
    let survey = {};
    survey.title = template.$("#form-title").val();
    survey.description = template.$("#form-description").val();
    survey.questions = [];
    let questions = template.$(".question-wrapper");

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

    survey.publishDate = template.$("#publish-date").closest(".date").datepicker('getDate');
    survey.expiryDate = template.$("#expiry-date").closest(".date").datepicker('getDate');

    Meteor.call("updateSurvey", this._id, survey, function (error, result) {
      let notificationOptions = {
        style: "bar",
        position: "top",
        type: "error"
      };
      if (error) {
        console.log(`Error invoking method 'updateSurvey'. Error: ${error.message}.`);
        switch (error.error) {
          case "not-logged-in":
            notificationOptions.message = "<b>Oops!</b> You must be logged in to edit a survey.";
            break;
          case "not-authorized":
            notificationOptions.message = "<b>Oops!</b> You are not authorized to edit a survey.";
            break;
          default:
            notificationOptions.message = "<b>Oops!</b> Something went wrong while editing the survey. Please try again.";
            break;
        }
      } else {
        Router.go('/surveys');
        console.log(`${result} document(s) updated in surveys collection.`);
        notificationOptions.message = "<b>Success!</b> Changes made to the survey have been saved.";
        notificationOptions.type = "success";
      }
      $('body').pgNotification(notificationOptions).show();
    });
  },
  'click #cancel-btn': function () {
    Router.go('/surveys');
  }
});
