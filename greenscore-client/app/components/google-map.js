import Ember from 'ember';

export default Ember.Component.extend({

  insertMap: function() {
    var container = this.$('.map-canvas')[0];

    var pointA = new window.google.maps.LatLng(51.7519, -1.2578);
    var pointB = new window.google.maps.LatLng(50.8429, -0.1313);

    var myOptions = {
      zoom: 7,
      center: pointA
    };

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

    var distanceService = new window.google.maps.DistanceMatrixService;

    distanceService.getDistanceMatrix({
      origins: [pointA],
      destinations: [pointB],
      travelMode: 'DRIVING',
      //transitOptions: TransitOptions,
      //drivingOptions: DrivingOptions,
      //unitSystem: UnitSystem,
      //avoidHighways: Boolean,
      //avoidTolls: Boolean,
    }, function(response, status) {
      if (status == window.google.maps.DirectionsStatus.OK) {
        //response.rows[0].elements[0].distance
      } else {
        window.alert('Directions request failed due to ' + status);
      }

    });

    directionsService.route({
      origin: pointA,
      destination: pointB,
      travelMode: window.google.maps.TravelMode.TRANSIT,
    }, function(response, status) {
      if (status == window.google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }.on('didInsertElement'),

});
