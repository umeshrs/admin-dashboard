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
  var checkbox = this.find(".switchery"), switchery;
  checkbox.checked = Template.currentData().published ? true : false;
  switchery = new Switchery(checkbox, { color: '#10CFBD', size: 'small' });
});
