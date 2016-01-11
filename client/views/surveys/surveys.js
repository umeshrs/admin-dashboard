Template.surveys.helpers({
  surveys: function () {
    return Surveys.find({}, {
      fields: { title: 1, createdAt: 1 },
      sort: { createdAt: 1 }
    });
  },
});

Template.surveys.events({
  'click .view-survey-btn': function () {
    Router.go('/surveys/view-survey/' + this._id);
  }
});
