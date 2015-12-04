Template.addSurvey.events({
  'click #add-question-btn': function (event) {
    var parentNode = $(event.target).closest(".btns-wrapper").siblings(".questions-wrapper")[0];
    Blaze.render(Template.question, parentNode);
  },
  'click #save-survey-btn': function (event) {
    var survey = {}, questions, question, options, option, i, j;
    survey.title = $(event.target).closest("#add-survey-form").find("#form-title").val();
    survey.description = $(event.target).closest("#add-survey-form").find("#form-description").val();
    survey.questions = [];
    questions = $(event.target).closest("#add-survey-form").find(".question-wrapper");

    for (i = 0; i < questions.length; i++) {
      question = {};
      question.text = $(questions[i]).find(".question").val();
      question.options = [];
      options = $(questions[i]).find(".option");

      for (j = 0; j < options.length; j++) {
        option = {};
        option.text = $(options[j]).val();
        question.options.push(option);
      }

      survey.questions.push(question);
    }

    survey.published = true;
    survey.createdAt = new Date();

    Surveys.insert(survey, function (error, result) {
      var notificationOptions = {
        style: "bar",
        position: "top",
        type: "success"
      };
      if (error) {
        console.log("Error creating survey. Error: ", error.message);
        notificationOptions.message = "<b>Error!</b> Something went wrong while creating the new survey. Please try again. " + error.message;
        notificationOptions.type = "error";
      } else {
        notificationOptions.message = "<b>Success!</b> New survey created.";
      }
      $('body').pgNotification(notificationOptions).show();
    });
  }
});

Template.question.events({
  'click .add-option': function (event) {
    var placeholder = "Option " + $(event.target).closest(".options-wrapper")[0].childElementCount;
    var parentNode = $(event.target).closest(".options-wrapper")[0];
    var nextNode = $(event.target).closest(".options-wrapper > :last-child")[0];
    Blaze.renderWithData(Template.option, { placeholder: placeholder }, parentNode, nextNode);
  }
});

Template.option.events({
  'click .remove-option': function (event, template) {
    Blaze.remove(template.view);
  }
});
