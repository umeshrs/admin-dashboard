Template.manageSurveys.helpers({
  surveys: function () {
    return Surveys.find({}, {
      fields: { title: 1, createdAt: 1, published: 1 },
      sort: { createdAt: 1 }
    });
  },
  dateCreated: function () {
    return this.createdAt.toLocaleString();
  }
});

Template.manageSurveys.events({
  'click #add-survey-btn': function () {
    Router.go('/add-survey');
  },
  'click .preview-survey-btn': function () {
    Router.go('/preview-survey/' + this._id);
  }
});

Template.switchery.onRendered(function () {
  var checkbox = this.find(".switchery"), switchery;
  checkbox.checked = Template.currentData().published ? true : false;
  switchery = new Switchery(checkbox, { color: '#10CFBD', size: 'small' });
});

Template.switchery.events({
  'change .switchery': function (event) {
    Surveys.update(this._id, { $set: { published: event.target.checked } });
  }
});
