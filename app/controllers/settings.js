import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import lift from '../routes/lift';

export default Controller.extend({
  store: service(),
  session: service(),

  editingLifts: false,
  newLiftName: '',
  newLiftMax: '',

  actions: {
    signOut() {
      return this.get('session').invalidate();
    },

    showliftInput() {
      this.set('editingLifts', true);
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

    cancelLiftChanges() {
      this.set('editingLifts', false);
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
    },

    decreaseBar(barLoading) {
      barLoading.set('bar', barLoading.get('bar') - 5);
      barLoading.save();
    },

    increaseBar(barLoading) {
      barLoading.set('bar', barLoading.get('bar') + 5);
      barLoading.save();
    }
  },

  clearNewLiftForm() {
    this.set('newLiftName', '');
    this.set('newLiftMax', '');
    this.set('editingLifts', false);
  }
});