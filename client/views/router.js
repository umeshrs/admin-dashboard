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
  if (! Meteor.userId()) {
    Router.go('login');
  } else {
    this.render('blankPage');
  }
});

Router.route('/chat', function () {
  if (! Meteor.userId()) {
    Router.go('login');
  } else {
    this.render('rocketChat');
  }
});

Router.route('/users', function () {
  if (! Meteor.userId()) {
    Router.go('login');
  } else {
    this.render('users');
  }
});
