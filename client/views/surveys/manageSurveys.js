Template.manageSurveys.onCreated(function () {
  let self = this;

  Session.setDefault("pageNumber", 1);
  Session.setDefault("recordsPerPage", 10);

  self.autorun(function () {
    Meteor.call("getSurveyCount", function (error, result) {
      if (error) {
        console.log(`Error invoking method 'getSurveyCount'. Error: ${error.message}`);
      } else {
        Session.set("numberOfPages", Math.ceil(result / Session.get("recordsPerPage")));
      }
    });

    let skip = (Session.get("pageNumber") - 1) * Session.get("recordsPerPage");
    if (skip < 0) {
      skip = 0;
      Session.set("pageNumber", 1);
    }
    let limit = Session.get("recordsPerPage");

    self.subscribe("surveys", skip, limit);
  });
});

Template.manageSurveys.onRendered(function () {
  Tracker.autorun(function () {
    if (Surveys.find({}, { sort: { createdAt: 1} }).count() > 0) {
      $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
      $('[data-tooltip-toggle="tooltip"]').tooltip({ container: 'body', trigger: 'hover' });
    }
  });
});

Template.manageSurveys.onDestroyed(function () {
  // clear pagination related Session values
  Session.delete("pageNumber");
  Session.delete("recordsPerPage");
  Session.delete("numberOfPages");
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
  }
});
