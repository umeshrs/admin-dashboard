Meteor.publish("surveys", function () {
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId, { fields: { 'profile.role': 1 } });
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Surveys.find({}, {
        fields: { description: 0, questions: 0 }
      });
    } else {
      return Surveys.find({ published: true }, {
        fields: { title: 1, createdAt: 1 }
      });
    }
  } else {
    return [];
  }
});
