Router.configure({
  layoutTemplate: "defaultLayout"
});

Router.route('/', function () {
  //ADD YOU ROUTES HERE
  //eg : this.render('home');
  this.render('blankPage');
},{
 layoutTemplate:"defaultLayout" 
});

Router.route('/chat', function () {
  this.render('rocketChat');
});

Router.onBeforeAction(function () {
  console.log("Before chat route");
  var domain, port;
  domain = "192.168.1.8";
  port = "4000";

  HTTP.post("http://" + domain + ":" + port + "/api/login",
    {
      data: {
        password: "umesh",
        user: "umesh"
      }
    }, function (error, result) {
      if (error) {
        console.log(error);
      }
      console.log(result);
      var url = "http://" + domain + ":" + port + "?token=" + result.data.data.authToken;
      console.log(url);
      Session.set("src", url);
  });
  this.next();
}, {
  only: ['chat']
  // or except: ['routeOne', 'routeTwo']
});
