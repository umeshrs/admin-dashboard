Template.storesList.onRendered(function () {
  $("#stores-list").height($(window).innerHeight() - 128 - $("#stores-list-container h1").outerHeight(true));
  $(window).resize(function () {
    $("#stores-list").height($(window).innerHeight() - 128 - $("#stores-list-container h1").outerHeight(true));
  });
});

Template.storesList.helpers({
  stores: function () {
    return Members.find({}, {sort: {createdAt: 1}});
  }
});

Template.storesList.events({
  'click #import-btn': function () {
    console.log("import btn");
    var config, memberDetails, i;

    config = {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results);

        for (i = 0; i < results.data.length; i++) {
          memberDetails = results.data[i];
          Members.insert({
            CIP: memberDetails['CIP'],
            member: {
              title: memberDetails['TITRE'],
              name: memberDetails['TITULAIRE'],
            },
            storeName: memberDetails['NOM OFFICINE'],
            lat: memberDetails['LATITUDE'],
            lng: memberDetails['LONGITUDE'],
            address: {
              street: memberDetails['ADRESSE'],
              postalCode: memberDetails['CP'],
              city: memberDetails['VILLE'],
              country: memberDetails['COUNTRY'] || ""
            },
            telephone: memberDetails['TELEPHONE'],
            fax: memberDetails['FAX'],
            createdAt: new Date()
          });
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
