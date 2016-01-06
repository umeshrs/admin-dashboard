Template.registerHelper("isAdministrator", function () {
  let currentUser = Meteor.user();
  return currentUser && currentUser.profile && currentUser.profile.role === "administrator";
});
