Meteor.methods({
  addResponse: function (surveyId, response) {
    var survey = Surveys.findOne(surveyId), i;

    for (i = 0; i < response.length; i++) {
      // update question and option responses count only if the question has been answered
      if (response[i].response) {
        // increment question responses count by 1
        Surveys.update({ _id: surveyId, 'questions.text': response[i].question }, { $inc: { 'questions.$.responses': 1 } });

        // iterate over options array and update responses count of the option which matches the question's response
        survey.questions[i].options.forEach(function (option) {
          if (option.text === response[i].response) {
            option.responses = option.responses || 0;
            option.responses++;
          }
        });

        // update options stored in Surveys collection
        Surveys.update({ _id: surveyId, 'questions.text': response[i].question }, {
          $set: { 'questions.$.options': survey.questions[i].options }
        });
      }
    }

    // increment survey responses count by 1
    Surveys.update({ _id: surveyId }, { $inc: { 'responses': 1 } });
  }
});
