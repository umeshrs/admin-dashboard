var markersListGlobal = [], infoWindow = {};

function initializeMap () {
  var styles = [
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { visibility: "simplified" }
      ]
    }, {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        { visibility: "on" },
        { color: "#b3b3b3" }
      ]
    }, {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        { visibility: "on" },
        { color: "#ffffff" }
      ]
    }, {
      featureType: "road.arterial",
      elementType: "geometry.stroke",
      stylers: [
        { visibility: "on" },
        { color: "#d6d6d6" }
      ]
    }, {
      featureType: "road.arterial",
      elementType: "geometry.fill",
      stylers: [
        { visibility: "on" },
        { color: "#ffffff" }
      ]
    }, {
      featureType: "road.local",
      elementType: "geometry.stroke",
      stylers: [
        { visibility: "on" },
        { color: "#d7d7d7" }
      ]
    }, {
      featureType: "road.local",
      elementType: "geometry.fill",
      stylers: [
        { visibility: "on" },
        { color: "#ffffff" },
        { weight: 1.5 }
      ]
    }, {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [
        { visibility: "off" }
      ]
    }, {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        { color: "#696969" }
      ]
    }, {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [
        { color: "#efefef" }
      ]
    }, {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        { color: "#a7a7a7" }
      ]
    }, {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [
        { visibility: "on" },
        { color: "#737373" }
      ]
    }, {
      featureType: "poi",
      elementType: "geometry.fill",
      stylers: [
        { color: "#ebebeb" }
      ]
    }, {
      featureType: "poi",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }, {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        { color: "#d3d3d3" }
      ]
    }, {
      featureType: "transit",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(48.8588589, 2.335864),
    zoom: 13,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    styles: styles
  });

  infoWindow = new google.maps.InfoWindow({
    maxWidth: 300,
    isOpen: false
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
  var storesList, marker, i, j, infoWindowContent, iconBase, markerIcon, storesListElements;

  // storesList = Stores.find({}, { sort: { lat: -1 }}).fetch();
  storesList = Members.find({}, { sort: { lat: -1 }}).fetch();
  marker = [];
  iconBase = "http://maps.google.com/mapfiles/ms/icons/";

  var infoWindowOpener = function (marker) {
    infoWindow.setContent(marker.infoWindowContent);
    infoWindow.open(map, marker);
    infoWindow.isOpen = true;
  };
  var infoWindowCloser = function () {
    if (infoWindow.isOpen) {
      infoWindow.close();
      infoWindow.isOpen = false;
    }
  };
  var infoWindowToggler = function (marker) {
    if (infoWindow.isOpen && infoWindow.content === marker.infoWindowContent) {
      infoWindow.close();
      infoWindow.isOpen = false;
    } else {
      infoWindow.setContent(marker.infoWindowContent);
      infoWindow.open(map, marker);
      infoWindow.isOpen = true;
    }
  };

  for (var i = 0; i < storesList.length; i++) {
    infoWindowContent = '<p>' +
      '<strong>' + storesList[i].storeName + '</strong><br />' +
      storesList[i].address.street + '<br />' +
      storesList[i].address.postalCode + ' ' + storesList[i].address.city + ', ' + storesList[i].address.country + '<br />' +
      '</p>';

    switch (storesList[i].task && storesList[i].task.status) {
      case "PENDING":
        markerIcon = iconBase + 'orange-dot.png';
        infoWindowContent += '<p class="text-warning">' +
          '<strong>Task</strong><br />' +
          storesList[i].task.title +
          '</p>';
        break;
      case "OVERDUE":
        markerIcon = iconBase + 'red-dot.png';
        infoWindowContent += '<p class="text-danger">' +
          '<strong>Task</strong><br />' +
          storesList[i].task.title +
          '</p>';
        break;
      default:
        markerIcon = iconBase + 'green-dot.png';
        infoWindowContent += '<p class="text-success">' +
          '<strong>Task</strong><br />' +
          'No pending task' +
          '</p>';
        break;
    }

    infoWindowContent += '<div class="btn-group pull-right">' +
        '<button type="button" class="btn btn-default chat-btn" title="Chat"><i class="fa fa-comment"></i></button>' +
        '<button type="button" class="btn btn-default project-btn" title="Project"><i class="fa fa-trello"></i></button>' +
        '<button type="button" class="btn btn-default info-btn" title="Info"><i class="fa fa-info"></i></button>'
      '</div>';

    marker[i] = new google.maps.Marker({
      position: new google.maps.LatLng(storesList[i].lat, storesList[i].lng),
      title: storesList[i].storeName,
      animation: (storesList[i].task && storesList[i].task.status === "OVERDUE") ? google.maps.Animation.BOUNCE : null,
      icon: markerIcon,
      infoWindowContent: infoWindowContent
    });

    marker[i].addListener('click', _.bind(infoWindowOpener, null, marker[i]));

    map.addListener('click', _.bind(infoWindowCloser, null));

    // DOM elements
    storesListElements = $("#stores-list > li");
    for (j = 0; j < storesListElements.length; j++) {
      if ($(storesListElements[j]).find("strong").html() === storesList[i].storeName) {
        storesListElements[j].addEventListener('click', _.bind(infoWindowToggler, null, marker[i]));
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
    // explicitly recenter the map when it is rendered
    map.setCenter(new google.maps.LatLng(48.8588589, 2.335864));
    clearMarkers();
    markersListGlobal = [];
    prepareMarkers();
    addMarkers();
  });
});

Template.googleMaps.events({
  'click .chat-btn': function () {
    Router.go('/chat');
  },
  'click .project-btn': function () {
    Router.go('/project');
  }
});
