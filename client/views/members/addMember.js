Template.addMember.onRendered(function () {
  $('[data-init-plugin="select2"]').select2({
      minimumResultsForSearch: ($(this).attr('data-disable-search') == 'true' ? -1 : 1)
  }).on('select2-opening', function() {
      $.fn.scrollbar && $('.select2-results').scrollbar({
          ignoreMobile: false
      })
  });

  this.$("#cip").mask("9999999");
  this.$("#postal-code").mask("99999");
  this.$("#telephone").mask("09 99 99 99 99");
  this.$("#fax").mask("09 99 99 99 99");
});

Template.addMember.events({
  'click #add-member-save-btn': function (event , template) {
    let options = {
      username: template.$('#username').val(),
      password: Accounts._hashPassword(template.$("#password").val()),
      email: template.$('#email').val(),
      profile: {
        CIP: template.$('#cip').val(),
        title: template.$('#title').val(),
        name: template.$('#owner-name').val(),
        pharmacyName: template.$('#pharmacy-name').val(),
        address: {
          street: template.$('#street-address').val(),
          city: template.$('#city').val(),
          postalCode: template.$('#postal-code').val()
        },
        telephone: template.$('#telephone').val(),
        fax: template.$('#fax').val(),
        role: "member",
        rewardPoints: 100
      }
    };

    Meteor.call("insertUser", options, function (error, result) {
      let notificationOptions = {
        style: "bar",
        position: "top",
        type: "error"
      };
      if (error) {
        console.log(`Error invoking method 'insertUser'. Error: ${error.message}.`);
        switch (error.error) {
          case "not-logged-in":
            notificationOptions.message = "<b>Oops!</b> You must be logged in to add a member.";
            break;
          case "not-authorized":
            notificationOptions.message = "<b>Oops!</b> You are not authorized to add a member.";
            break;
          default:
            notificationOptions.message = "<b>Oops!</b> Something went wrong while adding the new member. Please try again.";
            break;
        }
      } else {
        Router.go('/members');
        console.log(`New user inserted into users collection. Result: ${result}`);
        notificationOptions.message = "<b>Success!</b> New member added.";
        notificationOptions.type = "success";
      }
      $('body').pgNotification(notificationOptions).show();
    });
  },
  'click #cancel-btn': function () {
    Router.go('/members');
  }
});
