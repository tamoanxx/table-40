import Ember from 'ember';

export default Ember.Component.extend({
  ajax: Ember.inject.service(),

  source: '1419 West 19th Street, Chicago, IL',
  destination: '1110 N Kedzie Ave, Chicago, IL',
  travelMode: 'TRANSIT',

  humanizedTravelMode: Ember.computed(function() {
    return this.get('travelMode').decamelize().capitalize();
  }),

  myGreenScore: Ember.computed(function() {
    var self = this;
    this.actions.getGreenScorePromise(this.get('travelMode'), 10, this.get('ajax')).then(function(out) {
      self.set('greenScore', out.GS)
    });
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

    rated(number) {
      // TODO hacks
      window.location = "http://greenscore.city/thankyou";
    },

    getGreenScorePromise(type, dist, ajax) {
      return ajax.request('https://c4or7fhrmf.execute-api.us-east-1.amazonaws.com/prod/greenscore/calculate', {
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          "type": type,
          "distance": '' + dist
        }),
        dataType: "json",
      });
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
