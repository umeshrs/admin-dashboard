Template.question.events({
  'click .add-option': function (event) {
    var placeholder = "Option " + $(event.target).closest(".options-wrapper")[0].childElementCount;
    var parentNode = $(event.target).closest(".options-wrapper")[0];
    var nextNode = $(event.target).closest(".options-wrapper > :last-child")[0];
    Blaze.renderWithData(Template.option, { placeholder: placeholder }, parentNode, nextNode);
  }
});
