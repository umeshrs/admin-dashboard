Template.addMember.onRendered(function () {
  $('[data-init-plugin="select2"]').select2({
      minimumResultsForSearch: ($(this).attr('data-disable-search') == 'true' ? -1 : 1)
  }).on('select2-opening', function() {
      $.fn.scrollbar && $('.select2-results').scrollbar({
          ignoreMobile: false
      })
  });
});

Template.addMember.events({
  'click #cancel-btn': function () {
    Router.go('/members');
  }
});
