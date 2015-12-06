Meteor.startup(function () {
  Meteor.call("getUserCount", function (error, result) {
    var options;
    if (error) {
      console.log("Error invoking getUserCount method. Error: ", error.message);
    } else {
      console.log("Number of users: ", result);
      if (result === 0) {
        // No registered users. So, create a default admin user.
        options = {
          username: "admin",
          password: Accounts._hashPassword("admin123"),
          email: "admin@test.com",
          profile: { name: "Admin" }
        };

        Meteor.call("addDefaultUser", options, function (error, result) {
          if (error) {
            console.log("Error creating default user. Error: ", error.message);
          } else {
            console.log("Default user created.");
          }
        });
      }
    }
  });
});

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

Router.route('/login', {
  layoutTemplate: "loginLayout",
  action: function () {
    if (! Meteor.userId()) {
      this.render('login');
    } else {
      Router.go('home');
    }
  }
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

Router.route('/manage-surveys', {
  action: function () {
    this.render('manageSurveys');
  }
});

Router.route('/add-survey', {
  action: function () {
    this.render('addSurvey');
  }
});

Router.route('/preview-survey/:_id', {
  action: function () {
    this.render('viewSurvey');
  },
  data: function () {
    var data = Surveys.findOne(this.params._id);
    if (data) {
      data.questions = data.questions.map(function (question, index) {
        question.index = index;
        question.options = question.options.map(function (option, index) {
          option.index = index;
          return option;
        });
        return question;
      });
    }
    return data;
  }
});

Router.route('/view-survey/:_id', {
  action: function () {
    this.render('viewSurvey');
  },
  data: function () {
    var data = Surveys.findOne(this.params._id);
    if (data) {
      data.questions = data.questions.map(function (question, index) {
        question.index = index;
        question.options = question.options.map(function (option, index) {
          option.index = index;
          return option;
        });
        return question;
      });
    }
    return data;
  }
});

Router.route('/survey-responses', {
  action: function () {
    this.render('surveyResponsesList');
  }
});
