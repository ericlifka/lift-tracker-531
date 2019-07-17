import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';
import { WEEK_IDS, applyWorkoutSpec } from '../utils/workout-specs';

export default Service.extend({
  store: service(),
  session: service(),

  barLoading: null,

  getBarLoading() {
    let barLoading = this.get('barLoading');
    if (barLoading) {
      return resolve(barLoading);
    }

    let userId = this.session.get('data.authenticated.user.uid');

    return this.store.findRecord('bar-loading', userId)
      .then(barLoading => {
        this.set('barLoading', barLoading);

        return barLoading;
      })
      .catch(() => {
        // clear fake record before creating new one
        this.store.unloadRecord(this.store.getReference('bar-loading', userId).internalModel);

        let barLoading = this.store.createRecord('bar-loading', {
          id: userId,
          bar: 45,
          rounding: 5,
          plates: [ 2.5, 5, 10, 25, 35, 45 ]
        });
        barLoading.save();
        this.set('barLoading', barLoading);

        return barLoading;
      });
  },

  getWeeks() {
    return resolve(WEEK_IDS);
  },

  getLiftsModel() {
    return resolve(this.get('data.lifts').map(lift => lift.name));
  },

  createWorkout(weekId, max, barLoading) {
    let barWeight = barLoading.get('bar');
    let userPlates = barLoading.get('plates').slice().sort((a, b) => b - a);
    let roundingFactor = barLoading.get('rounding');

    let sets = [{
      name: "Workout",
      movements: applyWorkoutSpec(weekId, max, barWeight, userPlates, roundingFactor)
    }];

    if (weekId !== "deload") {
      sets.unshift({
        name: "Warmup",
        movements: applyWorkoutSpec('warmup', max, barWeight, userPlates, roundingFactor)
      });
    }

    return sets;
  },

  createLogEntry(weight, reps, estimatedMax) {
    let userId = this.session.get('data.authenticated.user.uid');
    let logEntry = this.store.createRecord('completed-workout', {
      userId, weight, reps, estimatedMax, date: new Date()
    });
    return logEntry.save();
  }
});