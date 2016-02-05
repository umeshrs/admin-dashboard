Meteor.startup(function () {
  SyncedCron.add({
    name: 'Publish surveys',
    schedule: function (parser) {
      // parser is a later.parse object
      return parser.cron('0 0 * * *');
    },
    job: function () {
      console.log(`[Cronjob -> Publish surveys]Publishing surveys for ${new Date().toLocaleString()}...`);
      Meteor.call("publishSurveys");
    }
  });

  SyncedCron.start();
});
