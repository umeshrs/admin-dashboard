Template.addMember.onRendered(function () {
  let template = this;

  Session.set("fieldRequired", template.data.task === "add-member" ? true : false);

  if (template.data && template.data.title) {
    template.$("#title").val(template.data.title);
  }

  template.$('[data-init-plugin="select2"]').select2({
    minimumResultsForSearch: ($(this).attr('data-disable-search') == 'true' ? -1 : 1)
  }).on('select2-opening', function () {
    $.fn.scrollbar && $('.select2-results').scrollbar({
      ignoreMobile: false
    })
  });

  template.$("#telephone").mask("09 99 99 99 99");
  template.$("#fax").mask("09 99 99 99 99");

  let validator = template.$("[id$='form']").validate({
    rules: {
      "owner-name": {
        required: true,
        maxlength: 30,
      },
      "pharmacy-name": {
        required: true,
        maxlength: 30,
      },
      "cip": {
        required: true,
        digits: true,
        minlength: 7,
        maxlength: 7,
      },
      "username": {
        required: true,
        maxlength: 20,
        nowhitespace: true,
        alphanumeric: true
      },
      "email": {
        required: true,
        email: true,
      },
      "password": {
        required: Session.equals("fieldRequired", true) ? true : false,
        nowhitespace: true,
        minlength: 6
      },
      "confirm-password": {
        required: Session.equals("fieldRequired", true) ? true : false,
        equalTo: "#password",
      },
      "street": {
        required: true,
        maxlength: 50,
      },
      "city": {
        required: true,
        maxlength: 30,
      },
      "postal-code": {
        required: true,
        digits: true,
        minlength: 5,
        maxlength: 5,
      }
    }
  });
});

Template.addMember.helpers({
  fieldRequired() {
    return Session.get("fieldRequired");
  }
});

Template.addMember.events({
  'submit #add-member-form': function (event, template) {
    event.preventDefault();

    let options = {
      username: template.$('#username').val(),
      password: Accounts._hashPassword(template.$("#password").val()),
      email: template.$('#email').val(),
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
        role: "member",
        rewardPoints: 500
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
  },
  'focusout #street, focusout #city': function (event, template) {
    if (! event.target.value.trim().length) {
      return;
    }

    let query = `address=${template.$("#street").val().trim().toLowerCase()}, ${template.$("#city").val().trim().toLowerCase()}`;

    HTTP.call("GET", "https://maps.googleapis.com/maps/api/geocode/json", { query: query }, function (error, result) {
      let address = {};
      if (error) {
        console.log(`Could not get result from geocoding API. Error: ${error.message}`);
      } else {
        console.log("Result from geocoding API:", result.data);
        if (result.data.status === "OK" && result.data.results[0].geometry.location_type === "ROOFTOP") {
          address.lat = result.data.results[0].geometry.location.lat;
          address.lng = result.data.results[0].geometry.location.lng;
          result.data.results[0].address_components.forEach(function (element) {
            switch (element.types[0]) {
              case "street_number":
                address.street = element.long_name;
                break;
              case "route":
                address.street = (address.street) ? address.street + " " + element.long_name : element.long_name;
                break;
              case "locality":
                address.city = element.long_name;
                break;
              case "postal_code":
                address.postalCode = element.long_name;
            }
          });
          template.$("#postal-code").val(address.postalCode);
          template.$("#latitude").val(address.lat);
          template.$("#longitude").val(address.lng);
        }
      }
    });
  }
});
