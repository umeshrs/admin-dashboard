Meteor.methods({
  insertSurvey(survey) {
    let currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to isnert a survey.");
    }
    else {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        // insert survey into surveys collection if user is logged in AND has a role of administrator
        return Surveys.insert(survey);
      }
      else {
        throw new Meteor.Error("not-authorized", "User not authorized to insert a survey.");
      }
    }
  }
});
