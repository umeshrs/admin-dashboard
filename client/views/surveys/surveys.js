Template.surveys.onCreated(function () {
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

Template.surveys.onRendered(function () {
  Tracker.autorun(function () {
    if (Surveys.find({}, { fields: { _id: 1 }, sort: { createdAt: 1} }).count() > 0) {
      $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
    }
  });
});

Template.surveys.onDestroyed(function () {
  // clear pagination related Session values
  Session.delete("pageNumber");
  Session.delete("recordsPerPage");
  Session.delete("numberOfPages");
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
