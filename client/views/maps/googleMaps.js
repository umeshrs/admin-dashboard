function initializeMap () {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(48.8588589, 2.335864),
    zoom: 13
  });
}

Template.googleMaps.onRendered(function () {
  initializeMap();
  $("#map-canvas").height($(window).innerHeight() - 128);
  $(window).resize(function () {
    $("#map-canvas").height($(window).innerHeight() - 128);
  });
});
