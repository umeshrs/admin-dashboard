Template.addMember.onRendered(function () {
  if (this.data && this.data.title) {
    this.$("#title").val(this.data.title);
  }

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
    if (! isValidInput()) {
      return;
    }

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
          street: template.$('#street').val(),
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
  },
  'input #owner-name': function () {
    validateName();
  },
  'input #pharmacy-name': function () {
    validatePharmacy();
  },
  'keyup #cip': function (event) {
    if (event.which !== 9 && event.which !== 16) {
      validateCIP();
    }
  },
  'input #username': function () {
    validateUsername();
  },
  'input #email': function () {
    validateEmail();
  },
  'input #password': function () {
    validatePassword();
  },
  'input #confirm-password': function () {
    validateConfirmPasswrod();
  },
  'input #street': function () {
    validateStreet();
  },
  'input #city': function () {
    validateCity();
  },
  'keyup #postal-code': function () {
    if (event.which !== 9 && event.which !== 16) {
      validatePostalCode();
    }
  }
});

isValidInput = function () {
  let isValidName = validateName(),
    isValidPharmacy = validatePharmacy(),
    isValidCIP = validateCIP(),
    isValidUsername = validateUsername(),
    isValidEmail = validateEmail(),
    isValidPassword = validatePassword(),
    isValidConfirmPassword = validateConfirmPasswrod(),
    isValidStreet = validateStreet(),
    isValidCity = validateCity(),
    isValidPostalCode = validatePostalCode();

  if (isValidName && isValidPharmacy && isValidCIP && isValidUsername && isValidEmail && isValidPassword && isValidConfirmPassword &&
    isValidStreet && isValidCity && isValidPostalCode) {
    return true;
  } else {
    return false;
  }
}

function validateName() {
  if (! $("#owner-name").val().length > 0) {
    $("#owner-name").addClass("has-error");
    Tracker.autorun(function () {
      if (TAPi18n.__("OWNER_NAME_EMPTY_ERROR")) {
        $("#owner-name-error").remove();
        $("#owner-name").after(`<label id="owner-name-error" class="error" for="owner-name">${TAPi18n.__("OWNER_NAME_EMPTY_ERROR")}</label>`);
      }
    });
    return false;
  } else {
    $("#owner-name").removeClass("has-error");
    $("#owner-name-error").remove();
    return true;
  }
}

function validatePharmacy() {
  if (! $("#pharmacy-name").val().length > 0) {
    $("#pharmacy-name").addClass("has-error");
    Tracker.autorun(function () {
      if (TAPi18n.__("PHARMACY_NAME_EMPTY_ERROR")) {
        $("#pharmacy-name-error").remove();
        $("#pharmacy-name").after(`<label id="pharmacy-name-error" class="error" for="pharmacy-name">${TAPi18n.__("PHARMACY_NAME_EMPTY_ERROR")}</label>`);
      }
    });
    return false;
  } else {
    $("#pharmacy-name").removeClass("has-error");
    $("#pharmacy-name-error").remove();
    return true;
  }
}

function validateCIP() {
  if (! (isNaN(parseInt($("#cip").val())) ? 0 : parseInt($("#cip").val()).toString().length) > 0) {
    $("#cip").addClass('has-error');
    Tracker.autorun(function () {
      if (TAPi18n.__("CIP_EMPTY_ERROR")) {
        $("#cip-error").remove();
        $("#cip").after(`<label id="cip-error" class="error" for="cip">${TAPi18n.__("CIP_EMPTY_ERROR")}</label>`);
      }
    });
    return false;
  } else {
    $("#cip").removeClass('has-error');
    $("#cip-error").remove();
    return true;
  }
}

function validateUsername() {
  if (! $("#username").val().length > 0) {
    $("#username").addClass('has-error');
    Tracker.autorun(function () {
      if (TAPi18n.__("USERNAME_EMPTY_ERROR")) {
        $("#username-error").remove();
        $("#username").after(`<label id="username-error" class="error" for="username">${TAPi18n.__("USERNAME_EMPTY_ERROR")}</label>`);
      }
    });
    return false;
  } else {
    $("#username").removeClass('has-error');
    $("#username-error").remove();
    return true;
  }
}

function validateEmail() {
  if (! $("#email").val().length > 0) {
    $("#email").addClass('has-error');
    Tracker.autorun(function () {
      if (TAPi18n.__("EMAIL_EMPTY_ERROR")) {
        $("#email-error").remove();
        $("#email").after(`<label id="email-error" class="error" for="email">${TAPi18n.__("EMAIL_EMPTY_ERROR")}</label>`);
      }
    });
    return false;
  } else {
    $("#email").removeClass('has-error');
    $("#email-error").remove();
    return true;
  }
}

function validatePassword() {
  if (! $("#password").val().length > 0) {
    $("#password").addClass('has-error');
    Tracker.autorun(function () {
      if (TAPi18n.__("PASSWORD_EMPTY_ERROR")) {
        $("#password-error").remove();
        $("#password").after(`<label id="password-error" class="error" for="password">${TAPi18n.__("PASSWORD_EMPTY_ERROR")}</label>`);
      }
    });
    return false;
  } else if ($("#password").val().length > 0 && $("#password").val().length < 6) {
    $("#password").addClass('has-error');
    Tracker.autorun(function () {
      if (TAPi18n.__("PASSWORD_LENGTH_ERROR")) {
        $("#password-error").remove();
        $("#password").after(`<label id="password-error" class="error" for="password">${TAPi18n.__("PASSWORD_LENGTH_ERROR")}</label>`);
      }
    });
    return false;
  } else {
    $("#password").removeClass('has-error');
    $("#password-error").remove();
    return true;
  }
}

function validateConfirmPasswrod() {
  if (! $("#confirm-password").val().length > 0) {
    $("#confirm-password").addClass('has-error');
    Tracker.autorun(function () {
      if (TAPi18n.__("CONFIRM_PASSWORD_EMPTY_ERROR")) {
        $("#confirm-password-error").remove();
        $("#confirm-password").after(`<label id="confirm-password-error" class="error" for="confirm-password">${TAPi18n.__("CONFIRM_PASSWORD_EMPTY_ERROR")}</label>`);
      }
    });
    return false;
  } else if ($("#confirm-password").val() !== $("#password").val()) {
    $("#confirm-password").addClass('has-error');
    Tracker.autorun(function () {
      if (TAPi18n.__("PASSWORD_MISMATCH_ERROR")) {
        $("#confirm-password-error").remove();
        $("#confirm-password").after(`<label id="confirm-password-error" class="error" for="confirm-password">${TAPi18n.__("PASSWORD_MISMATCH_ERROR")}</label>`);
      }
    });
    return false;
  } else {
    $("#confirm-password").removeClass('has-error');
    $("#confirm-password-error").remove();
    return true;
  }
}

function validateStreet() {
  if (! $("#street").val().length > 0) {
    $("#street").addClass('has-error');
    Tracker.autorun(function () {
      if (TAPi18n.__("STREET_EMPTY_ERROR")) {
        $("#street-error").remove();
        $("#street").after(`<label id="street-error" class="error" for="street">${TAPi18n.__("STREET_EMPTY_ERROR")}</label>`);
      }
    });
    return false;
  } else {
    $("#street").removeClass('has-error');
    return true;
  }
}

function validateCity() {
  if (! $("#city").val().length > 0) {
    $("#city").addClass('has-error');
    Tracker.autorun(function () {
      if (TAPi18n.__("CITY_EMPTY_ERROR")) {
        $("#city-error").remove();
        $("#city").after(`<label id="city-error" class="error" for="city">${TAPi18n.__("CITY_EMPTY_ERROR")}</label>`);
      }
    });
    return false;
  } else {
    $("#city").removeClass('has-error');
    return true;
  }
}

function validatePostalCode() {
  if (! (isNaN(parseInt($("#postal-code").val())) ? 0 : parseInt($("#postal-code").val()).toString().length) > 0) {
    $("#postal-code").addClass('has-error');
    Tracker.autorun(function () {
      if (TAPi18n.__("CIP_EMPTY_ERROR")) {
        $("#postal-code-error").remove();
        $("#postal-code").after(`<label id="postal-code-error" class="error" for="postal-code">${TAPi18n.__("POSTAL_CODE_EMPTY_ERROR")}</label>`);
      }
    });
    return false;
  } else {
    $("#postal-code").removeClass('has-error');
    $("#postal-code-error").remove();
    return true;
  }
}
