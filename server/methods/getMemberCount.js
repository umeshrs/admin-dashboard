Meteor.methods({
  getMemberCount() {
    return Meteor.users.find({ 'profile.role': "member" }, { fields: { _id: 1 } }).count();
  }
});
