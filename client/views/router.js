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