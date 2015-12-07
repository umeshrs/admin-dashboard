Meteor.methods({
  removeSurvey: function (surveyId) {
    console.log("Request to remove survey with id " + surveyId);
    var currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to delete a survey.");
    }
    else {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        // remove survey if user is logged in and has a role of administrator
        return Surveys.remove(surveyId);
      }
      else {
        throw new Meteor.Error("not-authorized", "You are not authorized to delete a survey.");
      }
    }
  }
});
