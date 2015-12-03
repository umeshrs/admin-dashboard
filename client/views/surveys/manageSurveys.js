Template.manageSurveys.onRendered(function () {
  var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
  // Success color: #10CFBD
  elems.forEach(function (html) {
    var switchery = new Switchery(html, {color: '#10CFBD'});
  });
});

Template.manageSurveys.helpers({
  surveys: function () {
    return Surveys.find({}, { fields: { title: 1, createdAt: 1, published: 1 } });
  },
  dateCreated: function () {
    return this.createdAt.toLocaleString();
  }
});

Template.manageSurveys.events({
  'click #add-survey-btn': function () {
    Router.go('/add-survey');
  }
});

Template.switchery.onRendered(function () {
  var switchery = new Switchery(this.find(".switchery"), {color: '#10CFBD'});
});
