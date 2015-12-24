Template.reaction.onRendered(function () {
  // set initial height of iframe
  $(".page-content-wrapper > .content > iframe").height( $(".page-content-wrapper > .content").height() - 56 );

  $(window).resize(function () {
    // update iframe height to the height of the content div when window is resized
    $(".page-content-wrapper > .content > iframe").height( $(".page-content-wrapper > .content").height() - 56 );
  });
});

Template.reaction.helpers({
  src: function () {
    return localStorage.getItem("reactionSrc");
  },
  style: function () {
    return localStorage.getItem("reactionSrc") ? "display: block;" : "display: none;";
  }
});
