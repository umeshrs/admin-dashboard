$.validator.addMethod("cipUnique", function (cip, element, params) {
  let exists = Meteor.users.findOne({ 'profile.CIP': cip, _id: { $ne: params[1] } }, { fields: { 'profile.CIP': 1 } });
  return exists ? false : true;
}, "CIP already exists.");
