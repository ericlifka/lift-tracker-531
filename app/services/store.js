import Service from '@ember/service';
import { Promise, resolve } from 'rsvp';
import { load } from '../data/access';
import { runMigrations } from '../data/migrations';

const week_specs = {
  'warmup': [
    { percent: .4, reps: 5 },
    { percent: .5, reps: 5 },
    { percent: .6, reps: 3 }
  ],
  '5-5-5': [
    { percent: .65, reps: 5 },
    { percent: .75, reps: 5 },
    { percent: .85, reps: 5, plusSet: true }
  ],
  '3-3-3': [
    { percent: .7, reps: 3 },
    { percent: .8, reps: 3 },
    { percent: .9, reps: 3, plusSet: true }
  ],
  '5-3-1': [
    { percent: .75, reps: 5 },
    { percent: .85, reps: 3 },
    { percent: .95, reps: 1, plusSet: true }
  ],
  'deload': [
    { percent: .4, reps: 5 },
    { percent: .5, reps: 5 },
    { percent: .6, reps: 5 }
  ]
};

function getWeekSpec(weekId) {
  return week_specs[ weekId ] || week_specs[ 'warmup' ];
}

function applyWorkoutSpec(spec, max) {
  return spec.map(movement => ({
    ...movement,
    plates: [], // tbd
    weight: round(movement.percent * max)
  }));
}

function round(weight) {
  let factor = 5;
  let half = factor / 2;

  return factor * Math.floor( (weight + half) / factor );
}

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

  getWeeks() {
    return resolve(['5-5-5', '3-3-3', '5-3-1', 'deload']);
  },

  getLifts() {
    return resolve(this.get('data.lifts').map(lift => lift.name));
  },

  getMax(liftId) {
    let lift = this.get('data.lifts').find(lift => lift.name === liftId);
    return lift ? lift.max : 0;
  },

  getWorkouts(weekId, liftId) {
    return new Promise(resolve => {
      let max = this.getMax(liftId);
      let sets = [{
        name: "Workout",
        movements: applyWorkoutSpec(getWeekSpec(weekId), max)
      }];

      if (weekId !== "deload") {
        sets.unshift({
          name: "Warmup",
          movements: applyWorkoutSpec(getWeekSpec('warmup'), max)
        })
      }

      resolve({
        sets,
        lift: liftId,
        week: weekId
      });
    });
  }
});