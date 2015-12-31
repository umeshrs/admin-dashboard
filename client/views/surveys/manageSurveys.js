Template.manageSurveys.helpers({
  surveys: function () {
    return Surveys.find({}, {
      fields: { title: 1, createdAt: 1, published: 1 },
      sort: { createdAt: 1 }
    });
  },
  dateCreated: function () {
    return this.createdAt.toLocaleString();
  }
});

Template.manageSurveys.events({
  'click #add-survey-btn': function () {
    Router.go('/manage-surveys/add-survey');
  },
  'click .preview-survey-btn': function () {
    Router.go('/manage-surveys/preview-survey/' + this._id);
  },
  'click .remove-survey-btn': function () {
    var surveyTitle = this.title;
    Meteor.call("removeSurvey", this._id, function (error, result) {
      var notificationOptions = {
        style: "bar",
        position: "top",
        type: "success"
      };
      if (error) {
        console.log("Error invoking method 'removeSurvey':", error.message);
        notificationOptions.message = "<b>Error!</b> " + error.reason;
        notificationOptions.type = "error";
      } else {
        notificationOptions.message = "<b>Success!</b> " + surveyTitle + " has been removed.";
        console.log(result + " document(s) removed from Surveys collection.");
      }
      $('body').pgNotification(notificationOptions).show();
    });
  },
  'click .edit-survey-btn': function (event) {
    Router.go('/manage-surveys/edit-survey/' + this._id);
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
