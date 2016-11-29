import Ember from 'ember';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),

  travelModes: [
    'DRIVING',
    'TRANSIT',
    'BICYCLING'
  ],

  toDest: '1419 West 19th Street, Chicago, IL',
  fromDest: '1110 N Kedzie Ave, Chicago, IL',

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


    //getGreenScorePromise(type, dist) {
      //return this.get('ajax').request('https://raw.githubusercontent.com/origilad/170/master/package.json');
    //},

    //async getGreenScore(type, dist) {
      //return await this.getGreenScorePromise(type, dist);
    //},

    getGreenScore(type, dist) {
      return 1;
    },

    async getDistance(source, dest, mode) {
      return await this.getDistancePromise(source, dest, mode);
    },

    async submitPoints() {
      var carDistance = await this.actions.getDistance('boston, ma', 'new york, ny', 'DRIVING');
      var carGreenScore = this.actions.getGreenScore('DRIVING', carDistance.dist.value)

      var transitDistance = await this.actions.getDistance('boston, ma', 'new york, ny', 'TRANSIT');
      var transitGreenScore = this.actions.getGreenScore('TRANSIT', transitDistance.dist.value)

      var bikeDistance = await this.actions.getDistance('boston, ma', 'new york, ny', 'BICYCLING');
      var bikeGreenScore = this.actions.getGreenScore('BYCYCLING', bikeDistance.dist.value)

      var walkDistance = await this.actions.getDistance('boston, ma', 'new york, ny', 'WALKING');
      var walkGreenScore = this.actions.getGreenScore('WALKING', walkDistance.dist.value)


      this.set('togglePoints', false);
      this.set('toggleOptions', true);
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
