Meteor.publish("surveys", function (skip, limit) {
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId, { fields: { 'profile.role': 1 } });
    if (currentUser.profile && currentUser.profile.role === "administrator") {
      return Surveys.find({}, {
        sort: { createdAt: 1 },
        skip: skip,
        limit: limit,
        fields: { description: 0, questions: 0 }
      });
    } else {
      let currentDate = new Date();
      return Surveys.find({
        published: true,
        publishDate: { $lte: currentDate },
        expiryDate: { $gte: currentDate }
      }, {
        sort: { publishDate: 1 },
        skip: skip,
        limit: limit,
        fields: { title: 1, publishDate: 1, expiryDate: 1 }
      });
    }
  } else {
    return [];
  }
});
