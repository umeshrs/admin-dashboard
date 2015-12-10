function initializeMap () {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(48.8588589, 2.335864),
    zoom: 13
  });
}

Template.googleMaps.onRendered(function () {
  initializeMap();
  $(".page-content-wrapper > .content #map-canvas").height($(window).innerHeight() - 128);
});
