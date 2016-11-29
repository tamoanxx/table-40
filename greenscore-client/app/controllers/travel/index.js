import Ember from 'ember';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),

  travelModes: [
    'DRIVING',
    'TRANSIT',
    'BICYCLING'
  ],

  togglePoints: true,
  toggleOptions: false,
  toggleMap: false,
  toggleRate: false,

  travelOptions: [],

  click(number) {
    console.log(number);
  },

  distanceService: function() {
    return new window.google.maps.DistanceMatrixService;
  },

  actions: {
    rate(number) {
      console.log("value");
      this.set('toggleRate', false);
      this.set('toggleEnd', true);
    },

    updateTo: function(to) {
      this.set('toDest', to);
    },

    updateFrom: function(from) {
      this.set('fromDest', from);
    },

    submitPoints() {
      this.set('togglePoints', false);
      this.set('toggleOptions', true);
    },

    submitRate() {
      this.set('toggleOptions', false);
      this.set('toggleRate', true);
    }
  }
});
