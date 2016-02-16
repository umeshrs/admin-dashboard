Template.members.onCreated(function () {
  let self = this;

  Session.setDefault("pageNumber", 1);
  Session.setDefault("recordsPerPage", 10);

  self.autorun(function () {
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

    self.subscribe("members", skip, limit);
  });
});

Template.members.onRendered(function () {
  // explicitly add vertical scrollbar to the window
  $("body").css("overflow-y", "scroll")

  Session.setDefault("currentUser", {});
});

Template.members.onDestroyed(function () {
  // clear pagination related Session values
  Session.delete("pageNumber");
  Session.delete("recordsPerPage");
  Session.delete("numberOfPages");

  // restore window scrollbar to its initial state
  $('body').css("overflow-y", "visible");
});

Template.members.helpers({
  members: function () {
    return Meteor.users.find({ 'profile.role': "member" }, { sort: { createdAt: 1 } });
  }
});

Template.members.events({
  'click #add-member-btn': function () {
    Router.go('/members/add-member');
  },
  'click #import-members-btn': function () {
    Router.go('/members/import-members');
  }
});

Template.member.onRendered(function () {
  $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
  $('[data-tooltip-toggle="tooltip"]').tooltip({ container: 'body', trigger: 'hover' });
});

Template.member.events({
  'click .edit-member-btn': function (event, template) {
    template.$('[data-toggle="tooltip"]').tooltip('hide');
    template.$('[data-tooltip-toggle="tooltip"]').tooltip('hide');
    Router.go(`/members/edit-member/${this._id}`);
  },
  'click .remove-member-btn': function () {
    Session.set("currentUser", this);
  }
});
