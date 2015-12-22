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
          profile: { name: "Admin", role: "administrator" }
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

_.extend(Router, {
  getParents: function () {
    if (! this.current()) {
      return;
    }
    var parents = [], currentRoute = this.current().route, route;

    for (route = currentRoute && this.routes[currentRoute.options.parent]; ! _.isUndefined(route); route = this.routes[route.options.parent]) {
      parents.push({
        name: route.getName(),
        label: route.options.label
      });
    }

    return parents.reverse();
  }
});

Router.configure({
  layoutTemplate: "defaultLayout",
  notFoundTemplate: "notFound"
});

Router.onBeforeAction(function () {
  if (! Meteor.userId()) {
    Router.go('login');
  } else {
    var menuItem = Router.current().route._path.split("/", 2)[1];
    $("ul.menu-items span.icon-thumbnail").removeClass("bg-primary");
    $("ul.menu-items a[href*='" + menuItem + "']").siblings(".icon-thumbnail").addClass("bg-primary");
    this.next();
  }
}, {
  except: ['login']
});

Router.route('/', function () {
  Router.go('home');
});

Router.route('/login', {
  name: "login",
  layoutTemplate: "loginLayout",
  action: function () {
    if (! Meteor.userId()) {
      this.render('login');
    } else {
      Router.go('home');
    }
  }
});

Router.route('/home', {
  name: "home",
  label: "Home",
  action: function () {
    this.render('storeLocator');
  }
});

Router.route('/chat', {
  name: "chat",
  label: "Chat",
  action : function () {
    this.render('rocketChat');
  }
});

Router.route('/projects', {
  name: "projects",
  label: "Projects",
  action: function () {
    this.render('wekan');
  }
});

Router.route('/products', {
  name: "products",
  label: "Products",
  action: function () {
    this.render('reaction');
  }
});

Router.route('/members', {
  name: "members",
  label: "Members",
  action: function () {
    this.render('users');
  }
});

Router.route('/manage-surveys', {
  name: "manage-surveys",
  label: "Manage surveys",
  action: function () {
    this.render('manageSurveys');
  }
});

Router.route('/manage-surveys/add-survey', {
  name: "add-survey",
  label: "Add survey",
  parent: "manage-surveys",
  action: function () {
    this.render('addSurvey');
  }
});

Router.route('/manage-surveys/preview-survey/:_id', {
  name: "preview-survey",
  label: "Preview survey",
  parent: "manage-surveys",
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

Router.route('/manage-surveys/edit-survey/:_id', {
  name: "edit-survey",
  label: "Edit survey",
  parent: "manage-surveys",
  action: function () {
    this.render('editSurvey');
  },
  data: function () {
    return Surveys.findOne(this.params._id);
  }
});

Router.route('/view-survey/:_id', {
  name: "view-survey",
  label: "View survey",
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
  name: "survey-responses",
  label: "Survey responses",
  action: function () {
    this.render('surveyResponsesList');
  }
});

Router.route('/survey-responses/view-response/:_id', {
  name: "view-response",
  label: "View response",
  parent: "survey-responses",
  action: function () {
    this.render('viewResponse');
  },
  data: function () {
    return Surveys.findOne(this.params._id);
  }
});
