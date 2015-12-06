Template.surveyResponsesList.helpers({
  surveys: function () {
    return Surveys.find({}, {
      fields: { title: 1, createdAt: 1, responses: 1 },
      sort: { createdAt: 1 }
    });
  },
  dateCreated: function () {
    return this.createdAt.toLocaleString();
  }
});
