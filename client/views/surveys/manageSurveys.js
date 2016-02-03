Template.manageSurveys.onRendered(function () {
  Tracker.autorun(function () {
    if (Surveys.find({}, { sort: { createdAt: 1} }).count() > 0) {
      $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
      $('[data-tooltip-toggle="tooltip"]').tooltip({ container: 'body', trigger: 'hover' });
    }
  });
});

Template.manageSurveys.helpers({
  surveys: function () {
    return Surveys.find({}, { sort: { createdAt: 1 } });
  },
});

Template.manageSurveys.events({
  'click #add-survey-btn': function () {
    Router.go('/surveys/add-survey');
  },
  'click .preview-survey-btn': function () {
    $('[data-toggle="tooltip"]').tooltip('hide');
    $('[data-tooltip-toggle="tooltip"]').tooltip('hide');
    Router.go('/surveys/preview-survey/' + this._id);
  },
  'click .remove-survey-btn': function () {
    $('[data-toggle="tooltip"]').tooltip('hide');
    $('[data-tooltip-toggle="tooltip"]').tooltip('hide');
    Session.set("currentSurvey", this);
  },
  'click .edit-survey-btn': function (event) {
    $('[data-toggle="tooltip"]').tooltip('hide');
    $('[data-tooltip-toggle="tooltip"]').tooltip('hide');
    Router.go('/surveys/edit-survey/' + this._id);
  },
  'click .view-responses-btn': function (event) {
    $('[data-toggle="tooltip"]').tooltip('hide');
    $('[data-tooltip-toggle="tooltip"]').tooltip('hide');
    Router.go('/surveys/view-response/' + this._id);
  },
  'change .switchery': function (event) {
    Surveys.update(this.surveyId, { $set: { published: event.target.checked } }, function (error, result) {
      if (error) {
        console.log(`Error updating survey published status. Error: ${error.message}`);
      } else {
        console.log(`Updated publish status of ${result} survey(s).`);
      }
    });
  }
});
