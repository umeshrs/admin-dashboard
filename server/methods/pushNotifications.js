Meteor.methods({
  pushNotifications: function (surveyId) {
    var i, users, notification, survey;
    survey = Surveys.findOne(surveyId, { fields: { title: 1 } });
    notification = {
      surveyId: surveyId,
      title: (survey && survey.title),
      text: "Please take this survey.",
      isUnread: true,
      type: "info",
      createdAt: new Date()
    };
    users = Meteor.users.find({ 'profile.role': "member" }, { fields: { _id: 1 } }).fetch();
    for (i = 0; i < users.length; i++) {
      Meteor.users.update(users[i]._id, { $push: { 'profile.notifications': notification } });
    }
  }
});
