Meteor.methods({
  updateSurvey(surveyId, survey) {
    if (! surveyId) {
      throw new Meteor.Error("survey-id-empty", "survey id cannot be empty");
    }

    let currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to update a survey.");
    }
    else {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        // update survey only if user is logged in and has a role of administrator
        return Surveys.update(surveyId, {
          $set: {
            title: survey.title,
            description: survey.description,
            questions: survey.questions,
            publishDate: survey.publishDate,
            expiryDate: survey.expiryDate
          }
        });
      }
      else {
        throw new Meteor.Error("not-authorized", "You are not authorized to update a survey.");
      }
    }
  }
});
