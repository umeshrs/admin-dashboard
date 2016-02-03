Meteor.methods({
  updateSurvey: function (surveyId, survey) {
    console.log("Request to update survey with id " + surveyId);
    var currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to edit a survey.");
    }
    else {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        // update survey only if user is logged in and has a role of administrator
        return Surveys.update(surveyId, {
          $set: {
            title: survey.title,
            description: survey.description,
            questions: survey.questions
          }
        });
      }
      else {
        throw new Meteor.Error("not-authorized", "You are not authorized to edit a survey.");
      }
    }
  }
});
