Template.removeSurveyModal.onRendered(function () {
  let template = this;

  template.$('#remove-survey-modal').on('show.bs.modal', function (event) {
    // add negative margin-right to body to compensate for the padding-right added by bootstrap modal
    $("body").css("margin-right", "-15px");
  });

  template.$('#remove-survey-modal').on('hidden.bs.modal', function (event) {
    // remove negative margin-right from body to compensate for the padding-right removed by bootstrap modal
    $("body").css("margin-right", "0px");
  });
});

Template.removeSurveyModal.events({
  'click #remove-survey-modal-btn': function () {
    let surveyId = Session.get("currentSurvey") && Session.get("currentSurvey")._id;

    Meteor.call("removeSurvey", surveyId, function (error, result) {
      let notificationOptions = {
        style: "bar",
        position: "top",
        type: "error"
      };
      if (error) {
        console.log(`Error invoking method 'removeSurvey'. Error: ${error.message}.`);
        switch (error.error) {
          case "not-logged-in":
            notificationOptions.message = "<b>Oops!</b> You must be logged in to remove a survey.";
            break;
          case "not-authorized":
            notificationOptions.message = "<b>Oops!</b> You are not authorized to remove a survey.";
            break;
          default:
            notificationOptions.message = "<b>Oops!</b> Something went wrong while removing the survey. Please try again.";
            break;
        }
      } else {
        console.log(`${result} document(s) removed from surveys collection.`);
        notificationOptions.message = `<b>Success!</b> ${Session.get("currentSurvey").title} has been removed.`;
        notificationOptions.type = "success";
      }
      $('body').pgNotification(notificationOptions).show();
    });
  }
});
