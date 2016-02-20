Template.switchery.onRendered(function () {
  let template = this, checkbox = template.find('.switchery');
  template.data.checked = template.data.checked ? true : false;
  checkbox.checked = template.data.checked;
  template.switchery = new ReactiveVar( new Switchery(checkbox, { color: '#67A023', size: 'medium' }) );
  template.autorun(function () {
    Template.parentData().switchery = template.switchery.get();
  });
});

Template.switchery.events({
  'change .switchery': function (event, template) {
    Template.currentData().checked = template.switchery.get().isChecked();
  }
});
