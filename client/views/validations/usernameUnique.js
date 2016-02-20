$.validator.addMethod("usernameUnique", function (username, element, params) {
  let exists = Meteor.users.findOne({ username: username, _id: { $ne: params[1] } }, { fields: { username: 1 } });
  return exists ? false : true;
}, "Username already exists.");
