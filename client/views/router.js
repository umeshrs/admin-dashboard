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
  notFoundTemplate: "notFound",
  loadingTemplate: "loading"
});

Router.onBeforeAction(function () {
  if (! Meteor.userId()) {
    Router.go('login');
  } else {
    var menuItem = Router.current().route._path.split("/", 2)[1];
    $("ul.menu-items span.icon-thumbnail").removeClass("bg-complete");
    $("ul.menu-items a[href*='" + menuItem + "']").siblings(".icon-thumbnail").addClass("bg-complete");
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
  waitOn: function () {
    return Meteor.subscribe("members");
  },
  action: function () {
    this.render('storeLocator');
  }
});

Router.route('/chat', {
  name: "chat",
  label: "Chat",
  parent: "home",
  action : function () {
    this.render('rocketChat');
  }
});

Router.route('/projects', {
  name: "projects",
  label: "Projects",
  parent: "home",
  action: function () {
    this.render('wekan');
  }
});

Router.route('/products', {
  name: "products",
  label: "Products",
  parent: "home",
  action: function () {
    this.render('reaction');
  }
});

Router.route('/members', {
  name: "members",
  label: "Members",
  parent: "home",
  waitOn: function () {
    return Meteor.subscribe("members");
  },
  action: function () {
    let currentUser = Meteor.user();
    if (currentUser) {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        this.render('members');
      } else {
        this.render('notFound');
      }
    } else if (currentUser === null) {
      this.render('notFound');
    } else {
      this.render('loading');
    }
  }
});

Router.route('/members/add-member', {
  name: "add-member",
  label: "Add member",
  parent: "members",
  action: function () {
    let currentUser = Meteor.user();
    if (currentUser) {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        this.render('addMember');
      } else {
        this.render('notFound');
      }
    } else if (currentUser === null) {
      this.render('notFound');
    } else {
      this.render('loading');
    }
  },
  data: function () {
    return { task: 'add-member' };
  }
});

Router.route('/members/edit-member/:_id', {
  name: "edit-member",
  label: "Edit member",
  parent: "members",
  waitOn: function () {
    return Meteor.subscribe("member", this.params._id);
  },
  action: function () {
    let currentUser = Meteor.user();
    if (currentUser) {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        this.render('editMember');
      } else {
        this.render('notFound');
      }
    } else if (currentUser === null) {
      this.render('notFound');
    } else {
      this.render('loading');
    }
  },
  data: function () {
    let member = Meteor.users.findOne(this.params._id) || {};
    let data = {};
    if (member) {
      data._id = member._id;
      data.username = member.username;
      data.email = member.emails && member.emails[0] && member.emails[0].address;
      if (member.profile) {
        data.title = member.profile.title;
        data.ownerName = member.profile.name;
        data.pharmacyName = member.profile.pharmacyName;
        data.CIP = member.profile.CIP;
        data.address = member.profile.address;
        data.telephone = member.profile.telephone;
        data.fax = member.profile.fax;
      }
    }
    data.task = 'edit-member';
    return data;
  }
});

Router.route('/members/import-members', {
  name: "import-members",
  label: "Import members",
  parent: "members",
  action: function () {
    let currentUser = Meteor.user();
    if (currentUser) {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        this.render('importMembers');
      } else {
        this.render('notFound');
      }
    } else if (currentUser === null) {
      this.render('notFound');
    } else {
      this.render('loading');
    }
  }
});

Router.route('/surveys', {
  name: "surveys",
  label: "Surveys",
  parent: "home",
  action: function () {
    let currentUser = Meteor.user();
    if (currentUser) {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        this.render('manageSurveys');
      } else {
        this.render('surveys');
      }
    } else if (currentUser === null) {
      this.render('notFound');
    } else {
      this.render('loading');
    }
  }
});

Router.route('/surveys/add-survey', {
  name: "add-survey",
  label: "Add survey",
  parent: "surveys",
  action: function () {
    this.render('addSurvey');
  }
});

Router.route('/surveys/preview-survey/:_id', {
  name: "preview-survey",
  label: "Preview survey",
  parent: "surveys",
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

Router.route('/surveys/edit-survey/:_id', {
  name: "edit-survey",
  label: "Edit survey",
  parent: "surveys",
  action: function () {
    this.render('editSurvey');
  },
  data: function () {
    return Surveys.findOne(this.params._id);
  }
});

Router.route('/surveys/view-response/:_id', {
  name: "view-response",
  label: "View response",
  parent: "surveys",
  action: function () {
    this.render('viewResponse');
  },
  data: function () {
    return Surveys.findOne(this.params._id);
  }
});

Router.route('surveys/view-survey/:_id', {
  name: "view-survey",
  label: "View survey",
  parent: "surveys",
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

Router.route('/rewards', {
  name: "rewards",
  label: "Rewards",
  parent: "home",
  waitOn: function () {
    return Meteor.subscribe("rewards");
  },
  action: function () {
    let currentUser = Meteor.user();
    if (currentUser) {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        this.render('rewards');
      } else {
        this.render('viewRewards');
      }
    } else if (currentUser === null) {
      this.render('notFound');
    } else {
      this.render('loading');
    }
  }
});

Router.route('/rewards/add-reward', {
  name: "add-reward",
  label: "Add Reward",
  parent: "rewards",
  action: function () {
    let currentUser = Meteor.user();
    if (currentUser) {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        this.render('addReward');
      } else {
        this.render('notFound');
      }
    } else if (currentUser === null) {
      this.render('notFound');
    } else {
      this.render('loading');
    }
  },
  data: function () {
    return { task: "add-reward" };
  }
});

Router.route('/rewards/edit-reward/:_id', {
  name: "edit-reward",
  label: "Edit Reward",
  parent: "rewards",
  waitOn: function () {
    return Meteor.subscribe("reward", this.params._id);
  },
  action: function () {
    let currentUser = Meteor.user();
    if (currentUser) {
      if (currentUser.profile && currentUser.profile.role === "administrator") {
        this.render('editReward');
      } else {
        this.render('notFound');
      }
    } else if (currentUser === null) {
      this.render('notFound');
    } else {
      this.render('loading');
    }
  },
  data: function () {
    let data = Rewards.findOne(this.params._id) || {};
    data.task = "edit-reward";
    return data;
  }
});
