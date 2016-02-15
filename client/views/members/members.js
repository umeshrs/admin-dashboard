Template.members.onRendered(function () {
  Session.setDefault("currentUser", {});
  Tracker.autorun(function () {
    if (Meteor.users.find({ 'profile.role': "member" }, { sort: { createdAt: 1} }).count() > 0) {
      $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
      $('[data-tooltip-toggle="tooltip"]').tooltip({ container: 'body', trigger: 'hover' });
    }
  });

  // set active class to the current page number
  this.$(".pagination .page-number").closest("li").removeClass("active");
  this.$(this.$(".pagination .page-number")[Session.get("pageNumber") - 1]).closest("li").addClass("active");

  if ( Session.equals("pageNumber", 1) ) {
    this.$(".previous").closest('li').addClass('disabled');
  }
  if ( Session.equals("pageNumber", Session.get("numberOfPages")) ) {
    this.$(".next").closest('li').addClass('disabled');
  }
});

Template.members.helpers({
  members: function () {
    return Meteor.users.find({ 'profile.role': "member" }, { sort: { createdAt: 1 } });
  },
  pages: function () {
    let pageNumbers = [];

    for (let i = 1; i <= Session.get("numberOfPages"); i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
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
  },
  'click .previous': function (event, template) {
    template.$('[data-toggle="tooltip"]').tooltip('hide');
    let previousPage = Session.get("pageNumber") - 1;
    Session.set("pageNumber", previousPage < 1 ? 1 : previousPage);
  },
  'click .next': function (event, template) {
    template.$('[data-toggle="tooltip"]').tooltip('hide');
    let nextPage = Session.get("pageNumber") + 1;
    Session.set("pageNumber", nextPage > Session.get("numberOfPages") ? Session.get("numberOfPages") : nextPage);
  }
});
