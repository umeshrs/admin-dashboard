Template.reaction.onRendered(function () {
  // set initial height of iframe
  $(".page-content-wrapper > .content > iframe").height( $(".page-content-wrapper > .content").height() );

  $(window).resize(function () {
    // update iframe height to the height of the content div when window is resized
    $(".page-content-wrapper > .content > iframe").height( $(".page-content-wrapper > .content").height() );
  });
});

Template.reaction.helpers({
  src: function () {
    return localStorage.getItem("reactionSrc");
  }
});
