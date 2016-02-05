Meteor.methods({
  pushTasks(task) {
    console.log(`Pushing tasks for ${task.title}...`);

    Meteor.users.update({ 'profile.role': "member" },
      { $push: { 'profile.tasks': task } },
      { multi: true });
  }
});
