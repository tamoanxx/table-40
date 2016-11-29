import Ember from 'ember';

export default Ember.Component.extend({

  source: '1419 West 19th Street, Chicago, IL',
  destination: '1110 N Kedzie Ave, Chicago, IL',
  travelMode: 'TRANSIT',

  greenScore: Ember.computed(function() {
    return 1;
  }),

  myDist: function() {
    var source = this.get('source');
    var dest = this.get('destination');
    var mode = this.get('travelMode');

    var self = this;
    this.actions.getDistancePromise(source, dest, mode).then(function(out) {
      self.set('myDistText', out.dist.text)
      self.set('myDur', out.dur.text)
    });
  }.property(''),

  actions: {
    getDistancePromise(source, dest, mode) {
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

    getGreenScore(dist) {
      return 1;
    },

    async getDistance() {
      return await this.getDistancePromise();
    },

    async distDuration() {
      return await this.actions.getDistance();
    },

    greenScore() {
      return this.actions.getGreenScore(carDistance.dist.value);
    }
  }
});
