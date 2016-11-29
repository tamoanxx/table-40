import Ember from 'ember';

export default Ember.Component.extend({

  travelMode: null,
  source: null,
  destination: null,
  containerClass: 'map-canvas',

  insertMap: function() {
    var pointA = this.get('source');
    var pointB = this.get('destination');
    var travelMode = this.get('travelMode');

    var myOptions = {
      zoom: 7,
      center: pointA
    };

    var containerClass = '.map-canvas'

    var container = this.$(containerClass)[0];

    var map = new window.google.maps.Map(container, myOptions);

    var directionsService = new window.google.maps.DirectionsService;
    var directionsDisplay = new window.google.maps.DirectionsRenderer({
      map: map
    });

    var markerA = new window.google.maps.Marker({
      position: pointA,
      title: "point A",
      label: "A",
      map: map
    });

    var markerB = new window.google.maps.Marker({
      position: pointB,
      title: "point B",
      label: "B",
      map: map
    });

    directionsService.route({
      origin: pointA,
      destination: pointB,
      travelMode: travelMode,
    }, function(response, status) {
      if (status == window.google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }.on('didInsertElement'),

});
