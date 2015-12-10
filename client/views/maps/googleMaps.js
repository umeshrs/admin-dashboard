markersListGlobal = [];

function initializeMap () {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(48.8588589, 2.335864),
    zoom: 13
  });
}

function addMarkers() {
  for (var i = 0; i < markersListGlobal.length; i++) {
    markersListGlobal[i].setMap(map);
  }
  console.log("Markers added: " + markersListGlobal.length);
}

function clearMarkers () {
  for (var i = 0; i < markersListGlobal.length; i++) {
    markersListGlobal[i].setMap(null);
  }
}

function updateMarkers () {
  clearMarkers();
  markersListGlobal = [];
  prepareMarkers();
  addMarkers();
}

function prepareMarkers () {
  var storesList, marker, i, j, infoWindow, infoWindowContent, iconBase, markerIcon, storesListElements;

  storesList = Stores.find({}, { sort: { lat: -1 }}).fetch();
  marker = [];
  infoWindow = [];
  iconBase = "http://maps.google.com/mapfiles/ms/icons/";

  var infoWindowOpener = function (infoWindow, marker) {
    if (infoWindow.ud_state === 0) {
      infoWindow.open(map, marker);
      infoWindow.ud_state = 1;
    }
  };
  var infoWindowCloser = function (infoWindow) {
    if (infoWindow.ud_state === 1) {
      infoWindow.close();
      infoWindow.ud_state = 0;
    }
  };
  var infoWindowToggler = function (infoWindow, marker) {
    if (infoWindow.ud_state) {
      infoWindow.close();
      infoWindow.ud_state = 0;
    } else {
      infoWindow.open(map, marker);
      infoWindow.ud_state = 1;
    }
  };

  for (var i = 0; i < storesList.length; i++) {
    infoWindowContent = '<p>' +
      '<strong>' + storesList[i].name + '</strong><br />' +
      storesList[i].address.street + '<br />' +
      storesList[i].address.postalCode + ' ' + storesList[i].address.city + ', ' + storesList[i].address.country + '<br />' +
      '</p>';

    switch (storesList[i].task.status) {
      case "NONE":
        markerIcon = iconBase + 'green-dot.png';
        infoWindowContent += '<p class="text-success">' +
          '<strong>Task</strong><br />' +
          'No pending task' +
          '</p';
        break;
      case "PENDING":
        markerIcon = iconBase + 'orange-dot.png';
        infoWindowContent += '<p class="text-warning">' +
          '<strong>Task</strong><br />' +
          storesList[i].task.title +
          '</p';
        break;
      case "OVERDUE":
        markerIcon = iconBase + 'red-dot.png';
        infoWindowContent += '<p class="text-danger">' +
          '<strong>Task</strong><br />' +
          storesList[i].task.title +
          '</p';
        break;
    }

    // markerIcon = iconBase + "green-dot.png";
    infoWindow[i] = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    infoWindow[i].ud_state = 0;
    marker[i] = new google.maps.Marker({
      position: new google.maps.LatLng(storesList[i].lat, storesList[i].lng),
      title: storesList[i].name,
      icon: markerIcon
    });

    marker[i].addListener('click', _.bind(infoWindowOpener, null, infoWindow[i], marker[i]));

    infoWindow[i].addListener('closeclick', _.bind(infoWindowCloser, null, infoWindow[i]));

    map.addListener('click', _.bind(infoWindowCloser, null, infoWindow[i]));

    // DOM elements
    storesListElements = $("#stores-list > li");
    for (j = 0; j < storesListElements.length; j++) {
      if ($(storesListElements[j]).find("strong").html() === storesList[i].name) {
        storesListElements[j].addEventListener('click', _.bind(infoWindowToggler, null, infoWindow[i], marker[i]));
      }
    }

    markersListGlobal.push(marker[i]);
  }
}

Template.googleMaps.onRendered(function () {
  initializeMap();
  $("#map-canvas").height($(window).innerHeight() - 128);
  $(window).resize(function () {
    $("#map-canvas").height($(window).innerHeight() - 128);
  });

  google.maps.event.addListenerOnce(map, 'idle', function(){
    // do something only the first time the map is loaded
    google.maps.event.trigger(map, 'resize');
    clearMarkers();
    markersListGlobal = [];
    prepareMarkers();
    addMarkers();
  });
});
