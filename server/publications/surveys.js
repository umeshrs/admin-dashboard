Meteor.publish("surveys", function () {
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId, { fields: { 'profile.role': 1 } });
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Surveys.find({}, {
        fields: { description: 0, questions: 0 }
      });
    } else {
      let currentDate = new Date();
      return Surveys.find({ publishDate: { $lte: currentDate }, expiryDate: { $gte: currentDate } }, {
        fields: { title: 1, publishDate: 1, expiryDate: 1 }
      });
    }
  } else {
    return [];
  }
});
