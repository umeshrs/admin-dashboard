Template.viewSurvey.events({
  'click #cancel-btn, click #back-btn': function () {
    Router.go('/surveys');
  },
  'click #submit-response-btn': function (event, template) {
    var questions = template.$(".question-wrapper"), i, response = [];

    for (i = 0; i < questions.length; i++) {
      response.push({
        question: this.questions[i].text,
        response: template.$(questions[i]).find("input:radio:checked").val()
      });
    }

    Meteor.call("addResponse", this._id, response, function (error, result) {
      var notificationOptions = {
        style: "bar",
        position: "top",
        type: "success"
      };
      if (error) {
        console.log("Error submitting survey. Error: ", error.message);
        notificationOptions.message = "<b>Error!</b> Could not submit your response. Please try again.";
        notificationOptions.type = "error";
      } else {
        Router.go('/surveys');
        notificationOptions.message = "<b>Success!</b> Your response has been submitted.";
      }
      $('body').pgNotification(notificationOptions).show();
    });
  }
});
