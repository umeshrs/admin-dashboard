$.validator.addMethod("rewardUnique", function (title, element, params) {
  let exists = Rewards.findOne({ title: title, _id: { $ne: params[1] } }, { fields: { title: 1 } });
  return exists ? false : true;
});
