Template.storesList.onRendered(function () {
  $("#stores-list").height($(window).innerHeight() - 60 - 56 - 68 - $("#stores-list-container h1").outerHeight(true));
  $(window).resize(function () {
    $("#stores-list").height($(window).innerHeight() - 60 - 56 - 68 - $("#stores-list-container h1").outerHeight(true));
  });
});

Template.storesList.helpers({
  stores: function () {
    return Members.find({}, {sort: {createdAt: 1}});
  }
});

Template.storesList.events({
  'click #import-btn': function () {
    var config;

    config = {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function (results) {
        var memberDetails, i;

        console.log(results);

        function addMember(memberDetails) {
          var query;

          query = "address=" +
            memberDetails['ADRESSE'].trim().toLowerCase() + ", " +
            memberDetails['VILLE'].trim().toLowerCase();

          HTTP.call("GET", "https://maps.googleapis.com/maps/api/geocode/json", { query: query }, function (error, result) {
            var member = {}, address = {}, lat, lng;
            console.log("----------------------");
            if (error) {
              console.log("Could not get result from geocoding API. Error: ", error.message);
            } else {
              console.log("Result: ", result.data);
              if (result.data.status === "OK") {
                lat = result.data.results[0].geometry.location.lat;
                lng = result.data.results[0].geometry.location.lng;
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
                    case "country":
                      address.country = element.long_name;
                      break;
                    case "postal_code":
                      address.postalCode = element.long_name;
                  }
                });
              }

              member = {
                CIP: memberDetails['CIP'],
                member: {
                  title: memberDetails['TITRE'] && memberDetails['TITRE'].trim(),
                  name: memberDetails['TITULAIRE'] && memberDetails['TITULAIRE'].trim(),
                },
                storeName: memberDetails['NOM OFFICINE'] && memberDetails['NOM OFFICINE'].trim(),
                lat: lat,
                lng: lng,
                address: address,
                telephone: memberDetails['TELEPHONE'] &&
                  (typeof memberDetails['TELEPHONE'] === String) ? memberDetails['TELEPHONE'].trim() : memberDetails['TELEPHONE'],
                fax: memberDetails['FAX'] &&
                  (typeof memberDetails['FAX'] === String) ? memberDetails['FAX'].trim() : memberDetails['FAX'],
                task: {
                  title: memberDetails['taskTitle'],
                  description: memberDetails['taskDescription'],
                  status: memberDetails['taskStatus']
                },
                createdAt: new Date()
              };

              console.log("Member: ", member);
              Members.insert(member, function (error, result) {
                if (error) {
                  console.log("Error:", error.message);
                } else {
                  console.log("New member inserted to members collection. Result: ", result);
                }
              });
              console.log("----------------------");
            }
          });
        }

        for (i = 0; i < results.data.length; i++) {
          memberDetails = results.data[i];
          Meteor.setTimeout(addMember.bind(this, memberDetails), i * 200);
        }

      }
    };

    $('#members-import-file').parse({
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
  }
});
