Template.addMember.onRendered(function () {
  $('[data-init-plugin="select2"]').select2({
      minimumResultsForSearch: ($(this).attr('data-disable-search') == 'true' ? -1 : 1)
  }).on('select2-opening', function() {
      $.fn.scrollbar && $('.select2-results').scrollbar({
          ignoreMobile: false
      })
  });
});
