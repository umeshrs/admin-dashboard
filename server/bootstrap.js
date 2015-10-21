Meteor.startup(function() {

});

Meteor.methods({
  getVersion: function () {
    var result = HTTP.get("http://localhost:4000/api/version", {});
    var version = result.data.versions.rocketchat;
    return version;
  }
});