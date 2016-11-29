import Ember from 'ember';

export default Ember.Route.extend({

  actions: {
    rate(number) {
      console.log('foo')
      debugger;
    }
  }
});
