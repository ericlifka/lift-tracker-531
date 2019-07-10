import Service from '@ember/service';
import { Promise, resolve } from 'rsvp';
import { load } from '../data/access';
import { runMigrations } from '../data/migrations';

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

  getWorkouts(weekId, liftId) {
    return resolve({
      "lift": liftId,
      "week": weekId,
      "sets": [{
        "name": "Warmup",
        "movements": [
          { "weight": 45, "reps": 5, "plates": [] },
          { "weight": 45, "reps": 5, "plates": [] },
          { "weight": 45, "reps": 3, "plates": [] }
        ]
      }, {
        "name": "Workout",
        "movements": [
          { "weight": 45, "reps": 5, "plates": [] },
          { "weight": 45, "reps": 5, "plates": [] },
          { "weight": 55, "reps": 5, "plates": [5], plusSet: true }
        ]
      }]
    });
  }
});
