import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

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

      let newLift = this.store.createRecord('lift', { name, max });
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

    increaseLift(liftId) {
      // this.store.updateMax(liftId, 5);
    },

    decreaseLift(liftId) {
      // this.store.updateMax(liftId, -5);
    }
  },

  clearNewLiftForm() {
    this.set('newLiftName', '');
    this.set('newLiftMax', '');
    this.set('creatingLift', false);
  }
});