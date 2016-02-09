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

  SyncedCron.add({
    name: 'Remove expired tasks',
    schedule: function (parser) {
      // parser is a later.parse object
      return parser.cron('0 0 * * *');
    },
    job: function () {
      console.log(`[Cronjob -> Remove expired tasks]Removing tasks with expiry date before ${new Date(new Date().setHours(0, 0, 0, 0)).toLocaleString()}...`);
      Meteor.call("removeExpiredTasks");
    }
  });

  SyncedCron.start();
});
