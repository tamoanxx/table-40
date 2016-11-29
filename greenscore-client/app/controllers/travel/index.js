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

  distanceService: function() {
    return new window.google.maps.DistanceMatrixService;
  },

  actions: {
    updateTo: function(to) {
      this.set('toDest', to);
    },

    updateFrom: function(from) {
      this.set('fromDest', from);
    },

    getDistancePromise: function(source, dest, mode) {
      return new Promise(function(resolve, reject) {
        var distanceService = new window.google.maps.DistanceMatrixService;

        distanceService.getDistanceMatrix({
          origins: [source],
          destinations: [dest],
          travelMode: mode,
          //transitOptions: TransitOptions,
          //drivingOptions: DrivingOptions,
          unitSystem: 1, // 0 metrics, 1 imperial
          //avoidHighways: Boolean,
          //avoidTolls: Boolean,
        }, function(response, status) {
          if (status == window.google.maps.DirectionsStatus.OK) {
            var distance = response.rows[0].elements[0].distance;
            var duration = response.rows[0].elements[0].duration;
            resolve({"dist": distance, "dur": duration});
          } else {
            reject(new Error('Failure' + status));
          }
        });
      });
    },

    async getDistance(source, dest, mode) {
      return await this.getDistancePromise(source, dest, mode);
    },

    async submitPoints() {
      var carDistance = await this.actions.getDistance('boston, ma', 'new york, ny', 'DRIVING');
      var transitDistance = await this.actions.getDistance('boston, ma', 'new york, ny', 'TRANSIT');
      var bikeDistance = await this.actions.getDistance('boston, ma', 'new york, ny', 'BICYCLING');
      var walkDistance = await this.actions.getDistance('boston, ma', 'new york, ny', 'WALKING');

      console.log(carDistance);
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
