Template.importMembers.onRendered(function () {
  let template = this;

  Session.set("progressPercent", 0);
  Session.set("membersImported", 0);
  Session.set("membersCount", 0);

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
});

Template.importMembers.onDestroyed(function () {
  Session.delete("progressPercent");
  Session.delete("membersImported");
  Session.delete("membersCount");
});

Template.importMembers.helpers({
  percent() {
    return Session.get("progressPercent");
  },
  membersImported() {
    return Session.get("membersImported");
  },
  membersCount() {
    return Session.get("membersCount");
  }
});

Template.importMembers.events({
  'submit #import-members-form': function () {
    event.preventDefault();

    // delay import if import button is clicked the second time onwards
    // used to wait till progress bar reset transition is complete
    let delay = Session.get("progressPercent") ? 1000 : 0;

    Session.set("progressPercent", 0);
    Session.set("membersImported", 0);
    Session.set("membersCount", 0);

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
            } else {
              console.log("Result: ", result.data);
              if (result.data.status === "OK") {
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
              }

              memberDetails['TITRE'] && memberDetails['TITRE'].trim().split(" ").forEach(function (e) {
                title += e;
              });

              title = title.toUpperCase();

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
                username: memberDetails['CIP'].toString(),
                password: Accounts._hashPassword(memberDetails['CIP'].toString()),
                email: (memberDetails['EMAIL'] && memberDetails['EMAIL'].trim()) || "",
                profile: {
                  CIP: memberDetails['CIP'].toString(),
                  title: title,
                  name: memberDetails['TITULAIRE'] && memberDetails['TITULAIRE'].trim(),
                  pharmacyName: memberDetails['NOM OFFICINE'] && memberDetails['NOM OFFICINE'].trim(),
                  address: address,
                  telephone: memberDetails['TELEPHONE'] && (typeof memberDetails['TELEPHONE'] === String) ?
                    memberDetails['TELEPHONE'].trim() : memberDetails['TELEPHONE'],
                  fax: memberDetails['FAX'] && (typeof memberDetails['FAX'] === String) ?
                    memberDetails['FAX'].trim() : memberDetails['FAX'],
                  role: "member",
                  rewardPoints: 100
                }
              };

              console.log("Member: ", member);
              Session.set("membersImported", Session.get("membersImported") + 1);
              Session.set("progressPercent", Math.floor(Session.get("membersImported") / Session.get("membersCount") * 100));
              Meteor.call("insertUser", member, function (error, result) {
                if (error) {
                  console.log(`Error invoking method 'inserUser'. Error: ${error.message}.`);
                } else {
                  console.log(`New user inserted into users collection. Result: ${result}.`);
                }
              });
              console.log("----------------------");
            }

            if (Session.equals("membersCount", httpRequestCount)) {
              // completed all requests
              let notificationOptions = {
                style: "bar",
                position: "top",
                type: "success",
                message: TAPi18n.__("IMPORT_SUCCESS_NOTIFICATION_MESSAGE", Session.get("membersCount"))
              };

              Meteor.setTimeout(function () {
                $('body').pgNotification(notificationOptions).show();
              }, 1000);
            }
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
