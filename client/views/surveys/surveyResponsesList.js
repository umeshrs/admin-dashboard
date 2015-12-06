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

Template.surveyResponsesList.events({
  'click .view-response-btn': function () {
    console.log(this._id);
    Router.go('/survey-responses/view-response/' + this._id);
  }
});
