Meteor.publish("survey", function (surveyId) {
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId, { fields: { 'profile.role': 1 } });
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Surveys.find(surveyId);
    } else {
      let currentDate = new Date();
      return Surveys.find({ _id: surveyId, publishDate: { $lte: currentDate }, expiryDate: { $gte: currentDate } }, {
        fields: { responses: 0, published: 0 }
      });
    }
  } else {
    return [];
  }
});
