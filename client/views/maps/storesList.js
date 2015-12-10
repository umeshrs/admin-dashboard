Template.storesList.onRendered(function () {
  $("#stores-list").height($(window).innerHeight() - 128 - $("#stores-list-container h1").outerHeight(true));
  $(window).resize(function () {
    $("#stores-list").height($(window).innerHeight() - 128 - $("#stores-list-container h1").outerHeight(true));
  });
});

Template.storesList.helpers({
  stores: function () {
    return Stores.find({}, {sort: {createdAt: 1}});
  }
});
