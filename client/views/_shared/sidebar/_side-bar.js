Template.sideBar.onRendered(function () {
  var menuItem = Router.current().route && Router.current().route._path.split("/", 2)[1];
  $(".sidebar-menu ul.menu-items a[href*='" + menuItem + "']").siblings(".icon-thumbnail").addClass("bg-primary");
});
