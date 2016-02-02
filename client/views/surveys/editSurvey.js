Template.editSurvey.onRendered(function () {
  this.$("#form-title").focus();
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
    var survey = {}, questions, question, options, option, i, j;
    survey.title = template.$("#form-title").val();
    survey.description = template.$("#form-description").val();
    survey.questions = [];
    questions = template.$(".question-wrapper");

    for (i = 0; i < questions.length; i++) {
      question = {};
      question.text = template.$(questions[i]).find(".question").val();
      question.options = [];
      options = template.$(questions[i]).find(".option");

      for (j = 0; j < options.length; j++) {
        option = {};
        option.text = template.$(options[j]).val();
        question.options.push(option);
      }

      survey.questions.push(question);
    }

    Meteor.call("updateSurvey", this._id, survey, function (error, result) {
      var notificationOptions = {
        style: "bar",
        position: "top",
        type: "success"
      };
      if (error) {
        console.log("Error invoking method 'updateSurvey':", error.message);
        notificationOptions.message = "<b>Error!</b> " + error.reason;
        notificationOptions.type = "error";
      } else {
        Router.go('/surveys');
        console.log(result + " document(s) updated in Surveys collection.");
        notificationOptions.message = "<b>Success!</b> Changes made to the survey have been saved.";
      }
      $('body').pgNotification(notificationOptions).show();
    });
  },
  'click #cancel-btn': function () {
    Router.go('/surveys');
  }
});
