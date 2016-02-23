Meteor.methods({
  addResponse(surveyId, response) {
    let currentUser = Meteor.user();
    if (! currentUser) {
      throw new Meteor.Error("not-logged-in", "User must be logged in to submit a survey response");
    }
    else {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        throw new Meteor.Error("admin-not-allowed", "Admin is not allowed to submit a survey response");
      }
      else {
        let previousResponse = Responses.findOne({ userId: this.userId, surveyId: surveyId });

        if (previousResponse) {
          throw new Meteor.Error("duplicate-response", "User has already responsed to this survey");
        }

        // submit response if user is logged in AND does not have a role of administrator
        let survey = Surveys.findOne(surveyId);

        for (let i = 0; i < response.length; i++) {
          // update question and option responses count only if the question has been answered
          if (response[i].response) {
            // increment question responses count by 1
            Surveys.update({ _id: surveyId, 'questions.text': response[i].question }, { $inc: { 'questions.$.responses': 1 } });

            // iterate over options array and update responses count of the option which matches the question's response
            survey.questions[i].options.forEach(function (option) {
              if (option.text === response[i].response) {
                option.responses = option.responses || 0;
                option.responses++;
              }
            });

            // update options stored in Surveys collection
            Surveys.update({ _id: surveyId, 'questions.text': response[i].question }, {
              $set: { 'questions.$.options': survey.questions[i].options }
            });
          }
        }

        // increment survey responses count by 1
        let result = Surveys.update({ _id: surveyId }, { $inc: { 'responses': 1 } });

        if (result) {
          // log this response in the Responses collection to keep track if a member has answered a particular survey
          Responses.insert({
            userId: this.userId,
            surveyId: surveyId,
            createdAt: new Date()
          });

          // remove survey from members' tasks list
          Meteor.users.update({ _id: this.userId }, {
            $pull: { 'profile.tasks': { surveyId: surveyId } }
          });
        }

        return result;
      }
    }
  }
});
