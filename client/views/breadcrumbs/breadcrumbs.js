Template.breadcrumbs.helpers({
  parents: function () {
    return Router.current() && Router.getParents();
  },
  currentRouteLabel: function () {
    return Router.current() && Router.current().route.options.label;
  }
});
