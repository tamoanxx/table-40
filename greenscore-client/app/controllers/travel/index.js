import Ember from 'ember';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),

  travelModes: [
    'DRIVING',
    'TRANSIT',
    'BICYCLING'
  ],

  //toDest: null, // '1419 West 19th Street, Chicago, IL',
  //fromDest: null, // '1110 N Kedzie Ave, Chicago, IL',

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

    submitPoints() {
      this.set('togglePoints', false);
      this.set('toggleOptions', true);
    },

    submitOption: function(option) {
      //this.set('toggleOptions', false);
      //this.set('toggleMap', true);
    },

    submitRate: function() {
      this.set('toggleMap', false);
      this.set('toggleRate', true);
    }
  }
});
