Template.pagination.onRendered(function () {
  let template = this;

  // set active class to the current page number
  template.$(".pagination .page-number").closest("li").removeClass("active");
  template.$(template.$(".pagination .page-number")[Session.get("pageNumber") - 1]).closest("li").addClass("active");

  // remove previous page button if current page is first page
  if ( Session.equals("pageNumber", 1) ) {
    template.$(".previous").closest('li').remove();
  }

  // remove next page button if current page is last page
  if ( Session.equals("pageNumber", Session.get("numberOfPages")) ) {
    template.$(".next").closest('li').remove();
  }

  template.$('[data-toggle="tooltip"]').tooltip({ container: 'body' });
});

Template.pagination.helpers({
  pages: function () {
    let pageNumbers = [];

    for (let i = 1; i <= Session.get("numberOfPages"); i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }
});

Template.pagination.events({
  'click .previous': function (event, template) {
    template.$('[data-toggle="tooltip"]').tooltip('hide');
    let previousPage = Session.get("pageNumber") - 1;
    Session.set("pageNumber", previousPage < 1 ? 1 : previousPage);
  },
  'click .next': function (event, template) {
    template.$('[data-toggle="tooltip"]').tooltip('hide');
    let nextPage = Session.get("pageNumber") + 1;
    Session.set("pageNumber", nextPage > Session.get("numberOfPages") ? Session.get("numberOfPages") : nextPage);
  },
  'click .page-number': function (event, template) {
    Session.set("pageNumber", template.$(".page-number").index(event.target) + 1);
  }
});
