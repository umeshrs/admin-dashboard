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
