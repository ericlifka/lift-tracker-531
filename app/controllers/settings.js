import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import lift from '../routes/lift';

export default Controller.extend({
  store: service(),
  session: service(),

  creatingLift: false,
  newLiftName: '',
  newLiftMax: '',

  actions: {
    signOut() {
      return this.get('session').invalidate();
    },

    showliftInput() {
      this.set('creatingLift', true);
    },

    saveNewLift(name, max) {
      if (!name || !max) {
        return;
      }

      let userId = this.session.get('data.authenticated.user.uid');
      let newLift = this.store.createRecord('lift', { name, max, userId });
      newLift.save()
        .then(() => {
          this.clearNewLiftForm();
        })
        .catch(error => {
          console.error('Error creating lift: ', error);
        });
    },

    cancelNewLift() {
      this.clearNewLiftForm();
    },

    increaseLift(lift) {
      lift.set('max', lift.get('max') + 5);
      lift.save();
    },

    decreaseLift(lift) {
      lift.set('max', lift.get('max') - 5);
      lift.save();
    }
  },

  clearNewLiftForm() {
    this.set('newLiftName', '');
    this.set('newLiftMax', '');
    this.set('creatingLift', false);
  }
});