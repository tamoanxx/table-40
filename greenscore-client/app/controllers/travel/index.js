import Ember from 'ember';

export default Ember.Controller.extend({

  travelModes: [
    'DRIVING',
    'TRANSIT',
    'BICYCLE'
  ],

  toDest: '',
  fromDest: '',

  togglePoints: true,
  toggleOptions: false,
  toggleMap: false,
  toggleRate: false,

  travelOptions: [],


  actions: {
    updateTo: function(to) {
      this.set('toDest', to);
    },

    updateFrom: function(from) {
      this.set('fromDest', from);
    },

    submitPoints: function() {

      var distanceService = new window.google.maps.DistanceMatrixService;

      var self = this;

      this.get('travelModes').forEach(function(travelMode) {
        distanceService.getDistanceMatrix({
          origins: [self.get('toDest')],
          destinations: [self.get('fromDest')],
          travelMode: travelMode,
          //transitOptions: TransitOptions,
          //drivingOptions: DrivingOptions,
          //unitSystem: UnitSystem,
          //avoidHighways: Boolean,
          //avoidTolls: Boolean,
        }, function(response, status) {
          if (status == window.google.maps.DirectionsStatus.OK) {
            var distance = response.rows[0].elements[0].distance
            self.get('travelOptions').pushObject({
              "type": travelMode,
              "dist": distance
            })
            //self.set('togglePoints', false);
            //self.set('toggleOptions', true);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      });

      debugger;

    },

    submitOption: function(option) {
      this.set('toggleOptions', false);
      this.set('toggleMap', true);
    },

    submitRate: function() {
      this.set('toggleMap', false);
      this.set('toggleRate', true);
    }
  }
});
