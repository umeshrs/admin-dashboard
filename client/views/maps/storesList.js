Template.storesList.onRendered(function () {
  this.$("#stores-list").height($(window).innerHeight() - 60 - 56 - 68 - this.$("h1").outerHeight(true));
  $(window).resize(function () {
    $("#stores-list").height($(window).innerHeight() - 60 - 56 - 68 - $("#stores-list-container h1").outerHeight(true));
  });

  this.$('[class|="scrollbar"]').scrollbar();
});

Template.storesList.helpers({
  stores: function () {
    return Members.find({}, {sort: {createdAt: 1}});
  }
});
