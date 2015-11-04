Meteor.startup(function() {

});

Meteor.methods({
  getVersion: function () {
    var result = HTTP.get("http://localhost:4000/api/version", {});
    var version = result.data.versions.rocketchat;
    return version;
  },
  getToken: function (username, password) {
    console.log("inside getToken method.");
    var domain, port, url, result, token;
    domain = "192.168.1.122";
    port = "4000";
    url = "http://" + domain + ":" + port + "/api/login";
    result = HTTP.post(url,
      {
        data: {
          password: password,
          user: username
        }
      });
    token = result.data.data.authToken;
    console.log("return value: ", { authToken: token });
    return { authToken: token };
  }
});

Meteor.users.allow({
  remove: function (userId, doc) {
    var currentUser, userRole;
    currentUser = Meteor.users.findOne({ _id: userId }, { fields: { 'profile.role': 1 } });
    userRole = currentUser.profile && currentUser.profile.role;
    if (userId !== doc._id && userRole === "administrator") {
      console.log("Access granted. You are an administrator and you are not trying to delete your own document.");
      return true;
    } else {
      console.log("Access denied. You are not an administrator or you are trying to delete your own document.");
      return false;
    }
  },
  fetch: []
});
