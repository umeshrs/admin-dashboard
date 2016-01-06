Template.claimRewardModal.onRendered(function () {
  // remove class 'disable-scroll' from modal if its content height is greater than the window height
  $("#claim-reward-modal").on('shown.bs.modal', function (event) {
    if ($(event.target).find(".modal-content").innerHeight() > $(window).innerHeight()) {
      $(event.target).removeClass('disable-scroll');
    }
  });

  // add class 'disable-scroll' (default) to modal when a modal is closed
  $("#claim-reward-modal").on('hidden.bs.modal', function (event) {
    $(event.target).addClass('disable-scroll');
  });
});

Template.claimRewardModal.helpers({
  reward() {
    return Session.get("currentReward");
  }
});
