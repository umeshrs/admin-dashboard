Router.configure({
  layoutTemplate: "defaultLayout",
  notFoundTemplate: "notFound"
});

Router.onBeforeAction(function () {
  if (! Meteor.userId()) {
    Router.go('login');
  } else {
    this.next();
  }
}, {
  except: ['login']
});

Router.route('/', function () {
  Router.go('home');
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

Router.route('dashboard', function () {
  this.render('wekan');
});

Router.route('shop', function () {
  this.render('reaction');
});

Router.route('/users', function () {
  this.render('users');
});
