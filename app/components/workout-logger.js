import Component from '@ember/component';
import { later } from '@ember/runloop';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { oneRepEstimate } from '../utils/one-rep-estimate';

export default Component.extend({
  classNames: [ 'workout-logger' ],

  store: service(),
  session: service(),

  showForm: false,
  saving: false,
  showSuccess: false,

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
      this.set('saving', true);
      this.set('showForm', false);

      let userId = this.session.get('data.authenticated.user.uid');
      let weight = this.get('weight');
      let reps = this.get('reps');
      let estimate = this.get('estimate');
      let lift = this.get('lift');
      let week = this.get('week');
      let isDeload = !!this.get('isDeload');

      let logEntry = this.store.createRecord('completed-workout', {
        userId, weight, reps, lift, isDeload,
        estimatedMax: isDeload ? 0 : estimate,
        date: new Date(),
      });

      return logEntry.save()
        .then(() => {
          lift.set(week, true);
          return lift.save();
        })
        .then(() => {
          this.set('showSuccess', true);
          this.set('saving', false);

          later(this, function () {
            history.back();
          }, 1000);
        });
    }
  },

  setInitialValues() {
    let weight = this.get('workout.movements.lastObject.weight');
    let reps = this.get('workout.movements.lastObject.reps');
    let isDeload = this.get('workout.isDeload');

    this.setProperties({ weight, reps, isDeload });
  }
});
