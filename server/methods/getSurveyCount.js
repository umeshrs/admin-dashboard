Meteor.methods({
  getSurveyCount() {
    let currentUser = Meteor.users.findOne(this.userId);
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Surveys.find({}, { fields: { _id: 1 } }).count();
    } else {
      let currentDate = new Date();
      return Surveys.find({
        published: true,
        publishDate: { $lte: currentDate },
        expiryDate: { $gte: currentDate }
      }, {
        fields: { _id: 1 }
      }).count();
    }
  }
});
