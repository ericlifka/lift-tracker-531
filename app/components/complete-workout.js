import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { oneRepEstimate } from '../utils/one-rep-estimate';

export default Component.extend({
  classNames: [ 'workout-logger' ],

  store: service(),
  session: service(),

  showForm: false,

  didReceiveAttrs() {
    this._super(...arguments);

    this.setInitialValues();
  },

  estimate: computed('weight', 'reps', function () {
    return oneRepEstimate(this.get('weight'), this.get('reps'));
  }),

  actions: {
    openForm() {
      this.set('showForm', true);
    },

    cancel() {
      this.set('showForm', false);
      this.setInitialValues();
    },

    submit() {
      let { weight, reps, estimate, lift } = this.getProperties('weight', 'reps', 'estimate', 'lift');
      let userId = this.session.get('data.authenticated.user.uid');

      let logEntry = this.store.createRecord('completed-workout', {
        userId, weight, reps, lift,
        estimatedMax: estimate,
        date: new Date(),
      });
      logEntry.save()
        .then(() => {
          this.set('showForm', false);
        });
    }
  },

  setInitialValues() {
    let weight = this.get('workout.movements.lastObject.weight');
    let reps = this.get('workout.movements.lastObject.reps');

    this.setProperties({ weight, reps });
  }
});
