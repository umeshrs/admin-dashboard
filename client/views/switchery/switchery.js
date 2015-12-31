Template.switchery.onRendered(function () {
  let checkbox = this.find('.switchery'), switchery;
  checkbox.checked = Template.currentData() && Template.currentData().checked ? true : false;
  switchery = new Switchery(checkbox, { color: '#67A023', size: 'medium' });
});
