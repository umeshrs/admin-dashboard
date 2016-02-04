Meteor.methods({
  publishSurveys() {
    let startDate = new Date(new Date().setHours(0, 0, 0, 0));
    let endDate = new Date(new Date().setHours(23, 59, 59, 999));
    let surveys = Surveys.find({ publishDate: { $gte: startDate, $lte: endDate } }).fetch();

    console.log("___________________________________________________");
    console.log(`${surveys.length} surveys with publish date ${startDate.toLocaleDateString()}`);
    surveys.forEach(function (survey) {
      console.log(`${survey.title}: ${survey.published}`);
      if (! survey.published) {
        console.log(`Publishing survey ${survey.title}...`);
        // set published field as true
        Surveys.update(survey._id, { $set: { published: true } });

        // push survey notification to all members
        let notification = {
          type: "survey",
          title: survey.title,
          text: "Please take this survey.",
          surveyId: survey._id,
          label: "info",
          read: false,
          createdAt: new Date()
        };
        Meteor.call("pushNotifications", notification);
      }
    });
  }
});
