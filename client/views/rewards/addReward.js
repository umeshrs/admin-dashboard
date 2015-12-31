Template.addReward.onRendered(function () {
  this.$('.date').datepicker({
    format: "dd/mm/yyyy",
    startDate: 'today',
    todayBtn: 'linked',
  });
});
