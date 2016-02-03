Template.surveys.onRendered(function () {
  Tracker.autorun(function () {
    if (Surveys.find({}, { fields: { _id: 1 }, sort: { createdAt: 1} }).count() > 0) {
      $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
    }
  });
});

Template.surveys.helpers({
  surveys: function () {
    return Surveys.find({}, { sort: { publishDate: 1 } });
  },
});

Template.surveys.events({
  'click .view-survey-btn': function () {
    $('[data-toggle="tooltip"]').tooltip('hide');
    Router.go('/surveys/view-survey/' + this._id);
  }
});
