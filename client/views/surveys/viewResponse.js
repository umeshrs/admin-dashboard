Template.viewResponse.helpers({
  percentage: function () {
    return (Math.floor((this.responses / Template.parentData().responses) * 10000) / 100);
  }
});
