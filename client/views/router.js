Router.configure({
  layoutTemplate: "defaultLayout"
});

Router.route('/', function () {
  if (! Meteor.userId()) {
    Router.go('login');
  } else {
    Router.go('home');
  }
});

Router.route('/login', function () {
  if (! Meteor.userId()) {
    this.render('login');
  } else {
    Router.go('home');
  }
}, {
  layoutTemplate: "loginLayout"
});

Router.route('/home', function () {
  this.render('blankPage');
});

Router.route('/chat', function () {
  this.render('rocketChat');
});

Router.route('/users', function () {
  this.render('users');
});
