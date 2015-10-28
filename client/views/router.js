Router.configure({
  layoutTemplate: "defaultLayout"
});

Router.route('/', function () {
  //ADD YOU ROUTES HERE
  //eg : this.render('home');
  this.render('login');
},{
 layoutTemplate:"defaultLayout" 
});

Router.route('/home', function () {
  this.render('blankPage');
});

Router.route('/chat', function () {
  this.render('rocketChat');
});
