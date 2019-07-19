import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: [ 'settings-lifts-control' ],

  store: service(),
  session: service(),

  editingLifts: false,

  didInsertElement(...args) {
    this._super(...args);

    this.set('pendingLifts', []);
    this.set('toDelete', []);
  },

  lifts: computed('model', function () {
    return this.get('model').toArray();
  }),

  actions: {
    addToLift(lift, amount) {
      lift.incrementProperty('max', amount);
      lift.save();
    },

    showEdit() {
      this.set('editingLifts', true);
    },

    saveEdit() {
      let lifts = this.get('lifts');
      let pending = this.get('pendingLifts');
      let toDelete = this.get('toDelete');

      pending.forEach(lift => {
        if (!lift.get('name')) {
          lift.set('name', 'new lift');
        }
        if (!lift.get('max')) {
          lift.set('max', 45);
        }

        lifts.pushObject(lift);
      });

      toDelete.forEach(lift => {
        lift.deleteRecord();
        lift.save();
      });

      lifts.forEach(lift => {
        lift.save();
      });

      this.set('toDelete', []);
      this.set('pendingLifts', []);
      this.set('editingLifts', false);
    },

    cancelEdit() {
      this.get('lifts').forEach(lift => {
        lift.rollbackAttributes();
      });

      this.get('toDelete').forEach(lift => {
        this.get('lifts').pushObject(lift);
      });

      this.set('toDelete', []);
      this.set('pendingLifts', []);
      this.set('editingLifts', false);
    },

    deleteLift(lift) {
      this.get('lifts').removeObject(lift);
      this.get('toDelete').pushObject(lift);
    },

    deletePending(lift) {
      this.get('pendingLifts').removeObject(lift);
    },

    addEmptyLift() {
      let lift = this.store.createRecord('lift', {
        userId: this.session.get('data.authenticated.user.uid'),
        name: '',
        max: ''
      });
      this.get('pendingLifts').pushObject(lift);
    }
  }
});
