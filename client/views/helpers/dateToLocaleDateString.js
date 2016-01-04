Template.registerHelper("dateToLocaleDateString", function (date) {
  return date ? date.toLocaleDateString('en-GB') : null;
});
