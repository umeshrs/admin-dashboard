Template.footer.onRendered(function () {
  // set default language of site based on the selected attribute of select#language element
  if (! localStorage.getItem("language")) {
    TAPi18n.setLanguage(this.$("#language").val());
    localStorage.setItem("language", this.$("#language").val());
  } else {
    TAPi18n.setLanguage(localStorage.getItem("language"));
    this.$("#language").val(localStorage.getItem("language"));
  }

  $('[data-init-plugin="select2"]').select2({
      minimumResultsForSearch: ($(this).attr('data-disable-search') == 'true' ? -1 : 1)
  }).on('select2-opening', function() {
      $.fn.scrollbar && $('.select2-results').scrollbar({
          ignoreMobile: false
      })
  });
});

Template.footer.events({
  'change #language': function (event, template) {
    TAPi18n.setLanguage(template.$(event.target).val());
    localStorage.setItem("language", template.$(event.target).val());
  }
});
