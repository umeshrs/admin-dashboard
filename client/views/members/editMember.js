Template.editMember.events({
  'submit #edit-member-form': function (event, template) {
    event.preventDefault();

    let options = {
      username: template.$('#username').val(),
      password: template.$("#password").val() && Accounts._hashPassword(template.$("#password").val()),
      email: template.$('#email').val().trim(),
      profile: {
        CIP: template.$('#cip').val(),
        title: template.$('#title').val(),
        name: template.$('#owner-name').val().trim(),
        pharmacyName: template.$('#pharmacy-name').val().trim(),
        address: {
          street: template.$('#street').val().trim(),
          city: template.$('#city').val().trim(),
          postalCode: template.$('#postal-code').val() && +template.$('#postal-code').val(),
          lat: template.$('#latitude').val(),
          lng: template.$('#longitude').val()
        },
        telephone: template.$('#telephone').val(),
        fax: template.$('#fax').val(),
      }
    };

    Meteor.call("updateUser", this._id, this.username, options, function (error, result) {
      let notificationOptions = {
        style: "bar",
        position: "top",
        type: "error"
      };
      if (error) {
        console.log(`Error invoking method 'updateUser'. Error: ${error.message}.`);
        switch (error.error) {
          case "not-logged-in":
            notificationOptions.message = "<b>Oops!</b> You must be logged in to edit a member.";
            break;
          case "not-authorized":
            notificationOptions.message = "<b>Oops!</b> You are not authorized to edit a member.";
            break;
          case "username-empty":
            notificationOptions.message = `<b>Oops!</b> Username cannot be empty. Please enter a username.`;
            break;
          case "username-exists":
            notificationOptions.message = `<b>Oops!</b> There is already a member with the username '${options.username}'.` +
              ` Please enter a different username.`;
            break;
          default:
            notificationOptions.message = "<b>Oops!</b> Something went wrong while editing the member. Please try again.";
            break;
        }
      } else {
        Router.go('/members');
        console.log(`${result} user(s) updated in users collection.`);
        notificationOptions.message = "<b>Success!</b> Changes made to the member have been saved.";
        notificationOptions.type = "success";
      }
      $('body').pgNotification(notificationOptions).show();
    });
  }
});
