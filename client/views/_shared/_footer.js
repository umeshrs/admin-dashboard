Template.footer.onRendered(function () {
  // set default language of site based on the selected attribute of select#language element
  TAPi18n.setLanguage(this.$("#language").val());

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
  }
});
