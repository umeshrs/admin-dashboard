Template.viewSurvey.events({
  'click #cancel-btn, click #back-btn': function () {
    Router.go('/surveys');
  },
  'click #submit-response-btn': function (event, template) {
    let self = this;
    let questions = template.$(".question-wrapper"), response = [];

    for (let i = 0; i < questions.length; i++) {
      response.push({
        question: this.questions[i].text,
        response: template.$(questions[i]).find("input:radio:checked").val()
      });
    }

    Meteor.call("addResponse", self._id, response, function (error, result) {
      let notificationOptions = {
        style: "bar",
        position: "top",
        type: "error"
      };
      if (error) {
        console.log(`Error invoking method 'addResponse'. Error: ${error.message}.`);
        switch (error.error) {
          case "not-logged-in":
            notificationOptions.message = "<b>Oops!</b> You must be logged in to respond to this survey.";
            break;
          case "admin-not-allowed":
            notificationOptions.message = "<b>Oops!</b> Admin is not allowed to respond to surveys.";
            break;
          case "duplicate-response":
            notificationOptions.message = "<b>Oops!</b> Looks like you have already responded to this survey. " +
              "Each member can submit only one response per survey.";
            break;
          default:
            notificationOptions.message = "<b>Oops!</b> Something went wrong while submitting your response to this " +
              "survey. Please try again.";
            break;
        }
      } else {
        Router.go('/surveys');
        console.log(`${result} document(s) updated in surveys collection.`);
        notificationOptions.message = `<b>Success!</b> Your response to the survey '${self.title}' has been submitted.`;
        notificationOptions.type = "success";
      }

      $('body').pgNotification(notificationOptions).show();
    });
  }
});
