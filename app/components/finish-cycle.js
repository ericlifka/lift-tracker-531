import Component from '@ember/component';
import { all } from 'rsvp';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: [ 'finish-cycle' ],

  wendler: service(),

  saving: false,
  showModal: false,
  increaseMaxes: true,

  init() {
    this._super(...arguments);
    window.component = this;
  },

  liftModels: computed('lifts.[]', function () {
    return this.get('lifts').map(lift => EmberObject.create({
      name: lift.get('name'),
      max: lift.get('max'),
      increase: 5,
      model: lift
    }));
  }),

  actions: {
    showModal() {
      this.set('showModal', true);
    },

    closeModal() {
      this.set('showModal', false);
    },

    increment(liftModel, value) {
      liftModel.incrementProperty('increase', value);
    },

    submit() {
      if (this.get('saving')) {
        return;
      }
      this.set('saving', true);

      let weeks = this.wendler.weeks();
      let models = this.get('liftModels');
      let increaseMaxes = this.get('increaseMaxes');

      return all(models.map(displayModel => {
        let model = displayModel.get('model');
        let increase = displayModel.get('increase');

        if (increaseMaxes) {
          model.incrementProperty('max', +increase);
        }
        weeks.forEach(week => model.set(week, false));

        return model.save();
      })).then(() => {
        this.set('showModal', false);
        this.set('saving', false);
        this.clearCompleted();
      });
    }
  }
});