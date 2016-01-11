Meteor.methods({
  removeSurvey(surveyId) {
    let currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to remove a survey");
    }
    else {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        // remove survey if user is logged in and has a role of administrator
        return Surveys.remove(surveyId);
      }
      else {
        throw new Meteor.Error("not-authorized", "User not authorized to remove a survey");
      }
    }
  }
});
