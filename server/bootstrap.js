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
    domain = "192.168.1.8";
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