Template.importMembers.onRendered(function () {
  let template = this;

  Session.set("membersCount", 0);
  Session.set("membersImported", 0);
  Session.set("membersInvalid", 0);

  let validator = template.$("#import-members-form").validate({
    rules: {
      "file": {
        required: true,
        fileValid: true
      }
    }
  });

  template.$("#file").on('change', function(event) {
    validator.element("#file");
  });

  template.autorun(function () {
    template.$("#file").rules("add", {
      messages: {
        required: TAPi18n.__("NO_FILE_ERROR"),
        fileValid: TAPi18n.__("INVALID_FILE_TYPE_ERROR"),
      }
    });

    // trigger validation to display updated error message if site language is changed
    // and validation has been performed on that element at least once
    if ( template.$("#file-error").length ) {
      validator.element("#file");
    }
  });

  // Subscribe to publication cipValues. Needed to check if member to be imported has already been imported before.
  template.subscribe("cipValues");

  // Subscribe to publication username. Needed to send to updateUser method.
  template.subscribe("usernames");
});

Template.importMembers.onDestroyed(function () {
  Session.delete("membersCount");
  Session.delete("membersImported");
  Session.delete("membersInvalid");
});

Template.importMembers.helpers({
  membersImported() {
    return Session.get("membersImported");
  },
  membersInvalid() {
    return Session.get("membersInvalid");
  },
  membersCount() {
    return Session.get("membersCount");
  },
  progressPercent() {
    return Session.get("membersCount") ? Math.floor( Session.get("membersImported") / Session.get("membersCount") * 100 ) : Session.get("membersCount");
  },
  invalidPercent() {
    return Session.get("membersImported") ? Math.floor( Session.get("membersInvalid") / Session.get("membersImported") * 100 ) : Session.get("membersInvalid");
  }
});

Template.importMembers.events({
  'submit #import-members-form': function () {
    event.preventDefault();

    // delay import if import button is clicked the second time onwards
    // used to wait till progress bar reset transition is complete
    let delay = Session.get("membersCount") ? 1000 : 0;

    Session.set("membersCount", 0);
    Session.set("membersImported", 0);
    Session.set("membersInvalid", 0);

    let config = {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function (results) {
        Session.set("membersCount", results.data.length);
        let httpRequestCount = 0;
        console.log(results);

        function addMember(memberDetails) {
          let query = `address=${memberDetails['ADRESSE'].trim().toLowerCase()}, ${memberDetails['VILLE'].trim().toLowerCase()}`;

          HTTP.call("GET", "https://maps.googleapis.com/maps/api/geocode/json", { query: query }, function (error, result) {
            let member = {}, address = {}, title = "";
            httpRequestCount++;
            console.log("----------------------");
            if (error) {
              console.log("Could not get result from geocoding API. Error: ", error.message);
              Session.set("membersInvalid", Session.get("membersInvalid") + 1);
            } else {
              console.log("Result: ", result.data);
              if (result.data.status === "OK") {
                let locationType = result.data.results[0].geometry.location_type;
                console.log(locationType);
                if (locationType === "ROOFTOP" || locationType === "RANGE_INTERPOLATED" || locationType === "GEOMETRIC_CENTER") {
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
                } else {
                  Session.set("membersInvalid", Session.get("membersInvalid") + 1);
                }
              }
            }

            if ($.isEmptyObject(address)) {
              address.street = memberDetails['ADRESSE'] && memberDetails['ADRESSE'].toString().trim();
              address.city = memberDetails['VILLE'] && memberDetails['VILLE'].toString().trim();
              address.postalCode = memberDetails['CP'] && memberDetails['CP'].toString().trim();
            }

            memberDetails['TITRE'] && memberDetails['TITRE'].trim().split(" ").forEach(function (e) {
              title += e.toUpperCase();
            });

            switch (title) {
              case "MME":
              case "MMES":
                title = "MRS";
                break;
              case "MLLE":
                title = "MISS";
                break;
              case "MR&MME":
              case "MME&MR":
                title = "MR&MRS";
                break;
              default:
                title = "MR";
            }

            member = {
              profile: {
                CIP: memberDetails['CIP'].toString(),
                title: title,
                name: memberDetails['TITULAIRE'] && memberDetails['TITULAIRE'].trim(),
                pharmacyName: memberDetails['NOM OFFICINE'] && memberDetails['NOM OFFICINE'].trim(),
                address: address,
                telephone: memberDetails['TELEPHONE'] && memberDetails['TELEPHONE'].toString().trim(),
                fax: memberDetails['FAX'] && memberDetails['FAX'].toString().trim(),
              }
            };

            let memberExists = Meteor.users.findOne({ 'profile.CIP': member.profile.CIP });
            if (memberExists) {
              console.log('updateUser');
              member.username = memberExists.username;
              member.email = memberExists.emails && memberExists.emails[0] && memberExists.emails[0].address;

              console.log("id: ", memberExists._id);
              console.log("username: ", member.username);
              console.log("Member: ", member);
              Meteor.call("updateUser", memberExists._id, member.username, member, function (error, result) {
                console.log(`count: ${httpRequestCount}`);
                console.log(`membersCount: ${Session.get("membersCount")}`);
                if (error) {
                  console.log(`Error invoking method 'updateUser'. Error: ${error.message}.`);
                } else {
                  console.log(`${result} user(s) updated in users collection.`);
                  Session.set("membersImported", Session.get("membersImported") + 1);
                }

                let notificationOptions = {
                  style: "bar",
                  position: "top"
                };

                if ( Session.equals("membersCount", Session.get("membersImported")) ) {
                  // imported all members successfully
                  notificationOptions.type = "success";
                  notificationOptions.message = TAPi18n.__( "IMPORT_SUCCESS_NOTIFICATION_MESSAGE", Session.get("membersImported") );
                  Meteor.setTimeout(function () {
                    $('body').pgNotification(notificationOptions).show();
                  }, 1000);
                } else if ( Session.equals("membersCount", httpRequestCount) ) {
                  // completed import process but not all members were imported
                  notificationOptions.type = "info";
                  notificationOptions.message = TAPi18n.__( "IMPORT_COMPLETE_NOTIFICATION_MESSAGE", Session.get("membersImported") );
                  Meteor.setTimeout(function () {
                    $('body').pgNotification(notificationOptions).show();
                  }, 1000);
                }
              });
            } else {
              console.log('insertUser');
              member.username = memberDetails['CIP'].toString().trim();
              member.password = Accounts._hashPassword(memberDetails['CIP'].toString().trim());
              member.email = ( memberDetails['EMAIL'] && memberDetails['EMAIL'].trim() ) || "";
              member.profile.role = "member";
              member.profile.rewardPoints = 500;
              console.log("Member: ", member);

              Meteor.call("insertUser", member, function (error, result) {
                console.log(`count: ${httpRequestCount}`);
                console.log(`membersCount: ${Session.get("membersCount")}`);
                if (error) {
                  console.log(`Error invoking method 'insertUser'. Error: ${error.message}.`);
                } else {
                  console.log(`New user inserted into users collection. Result: ${result}.`);
                  Session.set("membersImported", Session.get("membersImported") + 1);
                }

                let notificationOptions = {
                  style: "bar",
                  position: "top"
                };

                if ( Session.equals("membersCount", Session.get("membersImported")) ) {
                  // imported all members successfully
                  notificationOptions.type = "success";
                  notificationOptions.message = TAPi18n.__( "IMPORT_SUCCESS_NOTIFICATION_MESSAGE", Session.get("membersImported") );
                  Meteor.setTimeout(function () {
                    $('body').pgNotification(notificationOptions).show();
                  }, 1000);
                } else if ( Session.equals("membersCount", httpRequestCount) ) {
                  // completed import process but not all members were imported
                  notificationOptions.type = "info";
                  notificationOptions.message = TAPi18n.__( "IMPORT_COMPLETE_NOTIFICATION_MESSAGE", Session.get("membersImported") );
                  Meteor.setTimeout(function () {
                    $('body').pgNotification(notificationOptions).show();
                  }, 1000);
                }
              });
            }
            console.log("----------------------");
          });
        }

        for (let i = 0; i < results.data.length; i++) {
          let memberDetails = results.data[i];
          Meteor.setTimeout(function () { addMember(memberDetails) }, i * 200);
        }

      }
    };

    Meteor.setTimeout(function () {
      $('#file').parse({
        config: config,
        before: function (file, inputElem) {
          console.log("Parsing file...", file);
        },
        error: function (err, file) {
          console.log("ERROR:", err, file);
        },
        complete: function (results) {
          console.log("Parsing complete.");
        }
      });
    }, delay);
  },
  'click #cancel-btn': function () {
    Router.go('/members');
  }
});
