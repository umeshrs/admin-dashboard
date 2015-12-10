Template.rocketChat.onRendered(function () {
  // set initial height of iframe
  $(".page-content-wrapper > .content > iframe").height( $(".page-content-wrapper > .content").height() );

  $(window).resize(function () {
    // update iframe height to the height of the content div when window is resized
    $(".page-content-wrapper > .content > iframe").height( $(".page-content-wrapper > .content").height() );
  });
});

Template.rocketChat.helpers({
  version: function () {
    Meteor.call("getVersion", function (error, result) {
      Session.set("version", result);
    });

    return Session.get("version");
  },
  src: function () {
    return localStorage.getItem("rocketChatSrc");
  },
  style: function () {
    if (localStorage.getItem("rocketChatSrc") !== "") {
      return "display: block;";
    }
    return "display: none;";
  }
});
