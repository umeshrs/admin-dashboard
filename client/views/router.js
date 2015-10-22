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

  HTTP.post("http://192.168.0.101:4000/api/login",
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
      var url = "http://192.168.0.101:4000?token=" + result.data.data.authToken;
      console.log(url);
      Session.set("src", url);
  });
  this.next();
}, {
  only: ['chat']
  // or except: ['routeOne', 'routeTwo']
});
