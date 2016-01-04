Template.registerHelper("dateToLocaleString", function (date) {
  return date ? date.toLocaleString('en-GB') : null;
});
