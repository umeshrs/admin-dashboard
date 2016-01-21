Template.importMembers.onRendered(function () {
  Session.set("progressPercent", 0);
  Session.set("membersImported", 0);
  Session.set("membersCount", 0);
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
  'click #import-members-btn': function () {
    let result = isValidFile();

    if (result.error) {
      if (result.error.error === "no-file") {
        console.log(result.error.message);
        $("#file").addClass("has-error");
        Tracker.autorun(function () {
          if (TAPi18n.__("NO_FILE_ERROR")) {
            $("#file-error").remove();
            $("#file").after(`<label id="file-error" class="error" for="file">${TAPi18n.__("NO_FILE_ERROR")}</label>`);
          }
        });
      } else if (result.error.error === "invalid-file-type") {
        $("#file").addClass("has-error");
        Tracker.autorun(function () {
          if (TAPi18n.__("INVALID_FILE_TYPE_ERROR")) {
            $("#file-error").remove();
            $("#file").after(`<label id="file-error" class="error" for="file">${TAPi18n.__("INVALID_FILE_TYPE_ERROR")}</label>`);
          }
        });
        console.log(result.error.message);
      }
      return;
    }

    let config = {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function (results) {
        Session.set("membersCount", results.data.length);
        console.log(results);

        function addMember(memberDetails) {
          let query = `address=${memberDetails['ADRESSE'].trim().toLowerCase()}, ${memberDetails['VILLE'].trim().toLowerCase()}`;

          HTTP.call("GET", "https://maps.googleapis.com/maps/api/geocode/json", { query: query }, function (error, result) {
            let member = {}, address = {}, title = "";
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
                  CIP: memberDetails['CIP'],
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
          });
        }

        for (let i = 0; i < results.data.length; i++) {
          let memberDetails = results.data[i];
          Meteor.setTimeout(function () { addMember(memberDetails) }, i * 150);
        }

      }
    };

    // delay import if import button is clicked the second time onwards
    // used to wait till progress bar reset transition is complete
    let delay = Session.get("progressPercent") ? 1000 : 0;

    Session.set("progressPercent", 0);
    Session.set("membersImported", 0);
    Session.set("membersCount", 0);

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
  },
  'change #file': function () {
    // clear file error when a file input value changes
    $("#file").removeClass("has-error");
    $("#file-error").remove();
  }
});

function isValidFile() {
  let result = {};

  if (! $("#file")[0].files.length) {
    result.error = {};
    result.error.error = "no-file";
    result.error.message = "No file uploaded.";
  } else if ($("#file")[0].files[0] && $("#file")[0].files[0].type !== "text/csv") {
    result.error = {};
    result.error.error = "invalid-file-type";
    result.error.message = "Invalid file type. Only CSV file is accepted.";
  } else {
    result.result = true;
  }

  return result;
}
