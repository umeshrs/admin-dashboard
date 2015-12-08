Template.defaultLayout.events({
  'click': function (event, template) {
    if (! template.$(event.target).closest(".dropdown").length) {
      Session.set("showNotificationDropdown", false);
    }
  }
});

Template.defaultLayout.rendered = function (){
	//INIT PAGES : API CALLS
	$('[data-pages="sidebar"]').sidebar();
}
