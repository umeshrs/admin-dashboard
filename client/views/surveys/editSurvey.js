Template.editSurvey.onRendered(function () {
  this.$("#form-title").focus();
});

Template.editSurvey.events({
  'focusin .form-control': function (event, template) {
    template.$(event.target).closest(".form-group-default").css({"padding-bottom": "9px", "border-bottom": "2px solid"});
  },
  'focusout .form-control': function (event, template) {
    template.$(event.target).closest(".form-group-default").css({"padding-bottom": "10px", "border-bottom": "1px inset"});
  },
  'click #add-question-btn': function (event) {
    var parentNode = $(event.target).closest(".btns-wrapper").siblings(".questions-wrapper")[0];
    Blaze.render(Template.question, parentNode);
  }
});
