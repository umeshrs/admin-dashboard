Template.viewSurvey.events({
  'click #cancel-btn': function () {
    Router.go('/manage-surveys');
  },
  'click #submit-response-btn': function (event, template) {
    var questions = template.$(".question-wrapper"), i, response = [];

    for (i = 0; i < questions.length; i++) {
      response.push({
        question: this.questions[i].text,
        response: template.$(questions[i]).find("input:radio:checked").val()
      });
    }

    Meteor.call("addResponse", this._id, response);
  }
});
