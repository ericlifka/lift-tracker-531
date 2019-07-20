import { all, resolve } from 'rsvp';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

const _mappings_ = {
  squat: "Squat",
  press: "Military Press",
  deadlift: "Dead Lift",
  bench: "Bench Press"
};
const createMapping = lifts => {
  let mapping = { };

  lifts.forEach(lift => {
    mapping[ _mappings_[ lift.get('name') ] ] = lift;
  });

  return mapping;
}

export default Controller.extend({
  store: service(),
  session: service(),

  processing: false,
  deleteOld: true,

  importCSV: '',

  actions: {
    processText() {
      if (!this.get('importCSV')) return;
      this.set('processing', true);
      let userId = this.session.get('data.authenticated.user.uid');

      return resolve()
        .then(() => this.dropData(userId))
        .then(() => this.importData(userId))
        .then(() => {
          console.log('all done');
          this.set('processing', false);
        });
    }
  },

  dropData(userId) {
    if (!this.get('deleteOld')) {
      return resolve();
    }
    return this.store.query('completed-workout', {
      filter: {
        userId
      }
    })
    .then(records => all(
      records.map(record => {
        record.deleteRecord();
        return record.save();
      })));
  },

  importData(userId) {
    let modelMappings = createMapping(this.get('model'));
    let text = this.get('importCSV');
    let promises = text
      .split('\n')
      .slice(6, -1)
      .map(row => row.split(','))
      .map(row => row.map(str => str.slice(1, -1)))
      .map(([_a,week,lift,_c,_d,_e,_f,_g,reps,weight,estimatedMax,date,_h,_i]) =>
        week === "4" || estimatedMax <= 0
          ? null // skip deload workouts
          : this.store.createRecord('completed-workout', {
              userId,
              lift: modelMappings[ lift ],
              reps: parseInt(reps, 10),
              weight: parseInt(weight, 10),
              estimatedMax: parseInt(estimatedMax, 10),
              date: new Date(date + "T12:00:00.000Z")
            }))
      .filter(model => !!model)
      .map(record => record.save());

    return all(promises);
  }
});