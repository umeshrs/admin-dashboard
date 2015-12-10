Template.storesList.helpers({
  stores: function () {
    return Stores.find({}, {sort: {createdAt: 1}});
  }
});
