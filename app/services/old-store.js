import Service from '@ember/service';
import { Promise, resolve } from 'rsvp';
import { set } from '@ember/object';

import { load } from '../data/access';
import { runMigrations } from '../data/migrations';
import { applyWorkoutSpec } from '../utils/workout-specs';

export default Service.extend({
  loadData() {
    return new Promise(resolve => {
      let data = load('lift-data');
      console.log('Loaded saved data:', data);
      data = runMigrations(data);
      console.log('Migrations run to update data:', data);

      this.set('data', data);
      resolve();
    });
  },

  getWeeksModel() {
    return resolve(['5-5-5', '3-3-3', '5-3-1', 'deload']);
  },

  getLiftsModel() {
    return resolve(this.get('data.lifts').map(lift => lift.name));
  },

  getWorkoutsModel(weekId, liftId) {
    return new Promise(resolve => {
      let max = this.getMax(liftId);
      let barWeight = this.getBarWeight();
      let userPlates = this.getUsersPlates();
      let roundingFactor = this.getRoundingFactor();

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

      resolve({
        sets,
        lift: liftId,
        week: weekId
      });
    });
  },

  getSettingsModel() {
    return this.get('data');
  },

  updateMax(liftId, increment) {
    let lift = this.get('data.lifts').find(lift => lift.name === liftId);
    if (lift) {
      set(lift, 'max', lift.max + increment);
    }
  },

  getMax(liftId) {
    let lift = this.get('data.lifts').find(lift => lift.name === liftId);
    return lift ? lift.max : 0;
  },

  getBarWeight() {
    return this.get('data.specifications.bar');
  },

  getRoundingFactor() {
    return this.get('data.specifications.round');
  },

  getUsersPlates() {
    return this.get('data.specifications.plates').sort((a, b) => b - a);
  }
});