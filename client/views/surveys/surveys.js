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
  // explicitly add vertical scrollbar to the window
  $('body').css("overflow-y", "scroll");
});

Template.surveys.onDestroyed(function () {
  // clear pagination related Session values
  Session.delete("pageNumber");
  Session.delete("recordsPerPage");
  Session.delete("numberOfPages");

  // restore window scrollbar to its initial state
  $('body').css("overflow-y", "visible");
});

Template.surveys.helpers({
  surveys: function () {
    return Surveys.find({}, { sort: { publishDate: 1 } });
  },
});

Template.surveyItem.onRendered(function () {
  let template = this;
  template.$('[data-toggle="tooltip"]').tooltip({ container: 'body' });
});

Template.surveyItem.events({
  'click .view-survey-btn': function (event, template) {
    template.$('[data-toggle="tooltip"]').tooltip('hide');
    Router.go('/surveys/view-survey/' + this._id);
  }
});
