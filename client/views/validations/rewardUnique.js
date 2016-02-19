$.validator.addMethod("rewardUnique", function (title) {
  let exists = Rewards.findOne({ title: title }, { fields: { title: 1 } });
  return exists ? false : true;
});
