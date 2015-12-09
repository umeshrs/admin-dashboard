Template.sideBar.events({
  'click ul.menu-items a': function (event, template) {
    template.$("ul.menu-items span.icon-thumbnail").removeClass("bg-primary");
    template.$(event.target).closest("li").find("> span.icon-thumbnail").addClass("bg-primary");
  }
});
