Template.manageSurveys.onRendered(function () {
  var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
  // Success color: #10CFBD
  elems.forEach(function (html) {
    var switchery = new Switchery(html, {color: '#10CFBD'});
  });
});

Template.manageSurveys.helpers({
  surveys: function () {
    return [{
      title: "Survey 1",
      dateCreated: "27/11/2015"
    }, {
      title: "Survey 2",
      dateCreated: "29/11/2015"
    }, {
      title: "Survey 3",
      dateCreated: "30/11/2015"
    }]
  }
});

Template.manageSurveys.events({
  'click #add-survey-btn': function () {
    Router.go('/add-survey');
  }
});
