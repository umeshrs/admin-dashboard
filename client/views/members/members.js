Template.members.onRendered(function () {
  Session.setDefault("currentUser", {});

  Tracker.autorun(function () {
    if (Meteor.users.find({ 'profile.role': "member" }, { sort: { createdAt: 1} }).count() > 0) {
      $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
      $('[data-tooltip-toggle="tooltip"]').tooltip({ container: 'body', trigger: 'hover' });
    }
  });

  Session.setDefault("pageNumber", 1);
  Session.setDefault("recordsPerPage", 10);

  Tracker.autorun(function () {
    Session.set("subscriptionReady", false);
    Meteor.call("getMemberCount", function (error, result) {
      if (error) {
        console.log(`Error invoking method 'getMemberCount'. Error: ${error.message}`);
      } else {
        Session.set("numberOfPages", Math.ceil(result / Session.get("recordsPerPage")));
      }
    });

    let skip = (Session.get("pageNumber") - 1) * Session.get("recordsPerPage");
    if (skip < 0) {
      skip = 0;
      Session.set("pageNumber", 1);
    }
    let limit = Session.get("recordsPerPage");

    Meteor.subscribe("members", skip, limit, function () {
      Session.set("subscriptionReady", true);
    });
  });
});

Template.members.helpers({
  members: function () {
    return Meteor.users.find({ 'profile.role': "member" }, { sort: { createdAt: 1 } });
  },
  subscriptionReady() {
    return Session.get("subscriptionReady");
  }
});

Template.members.events({
  'click #add-member-btn': function () {
    Router.go('/members/add-member');
  },
  'click #import-members-btn': function () {
    Router.go('/members/import-members');
  },
  'click .edit-member-btn': function () {
    $('[data-toggle="tooltip"]').tooltip('hide');
    $('[data-tooltip-toggle="tooltip"]').tooltip('hide');
    Router.go(`/members/edit-member/${this._id}`);
  },
  'click .remove-member-btn': function () {
    Session.set("currentUser", this);
  }
});
