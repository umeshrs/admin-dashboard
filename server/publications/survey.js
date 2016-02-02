Meteor.publish("survey", function (surveyId) {
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId, { fields: { 'profile.role': 1 } });
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Surveys.find(surveyId, {
        fields: { responses: 0 }
      });
    } else {
      return [];
    }
  } else {
    return [];
  }
});
