import { all } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  wendler: service(),

  model() {
    return this.wendler.getLifts().then(liftsRecords => {
      let recordsPromises = liftsRecords.map(lift => lift.get('completedWorkouts'));

      return all(recordsPromises).then(workoutLiftRecords => {
        let lifts = liftsRecords.toArray();
        let model = [ ];

        for (let i = 0; i < lifts.length; i++) {
          let lift = lifts[ i ];
          let data = workoutLiftRecords[ i ];

          data = data
            .map(record => record.getProperties('date', 'estimatedMax', 'weight', 'reps'))
            .map(({ date, estimatedMax, weight, reps }) => ({
              x: new Date(date),
              y: estimatedMax,
              weight, reps
            }))
            .sort((l, r) => l.x - r.x)

          model.push({ data, name: lift.get('name') });
        }

        return model;
      });
    });
  }
});
