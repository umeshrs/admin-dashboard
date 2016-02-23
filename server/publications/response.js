Meteor.publish("response", function (userId, surveyId) {
  if (this.userId) {
    return Responses.find({ userId: userId, surveyId: surveyId }, { fields: { createdAt: 1 } });
  } else {
    return [];
  }
});
