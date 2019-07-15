import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: [ 'settings-bar-loading-control' ],

  init(...args) {
    this._super(...args);

    this.setProperties({
      editing: false,
      newPlateValue: '',
      commonBarWeights: [ 15, 25, 35, 45, 55 ],
      commonRoundingThresholds: [ 1, 2.5, 5, 10 ]
    });
  },

  showWeightsWarning: computed('model.{rounding,plates.[]}', function () {
    let round = this.get('model.rounding');
    let smallestPlate = this.get('model.plates.0');

    return smallestPlate * 2 > round;
  }),

  actions: {
    showEdit() {
      this.set('editing', true);
    },

    cancelEdit() {
      this.get('model').rollbackAttributes();
      this.set('editing', false);
    },

    saveEdit() {
      this.get('model').save();
      this.set('editing', false);
    },

    setBarWeight(weight) {
      this.set('model.bar', weight);
    },

    setRoundingWeight(weight) {
      this.set('model.rounding', weight);
    },

    deletePlate(plate) {
      let plates = this.get('model.plates');
      plates = plates.filter(p => p != plate);
      this.set('model.plates', plates);
    },

    addNewPlate() {
      let plate = parseFloat(this.get('newPlateValue'));
      if (!Number.isNaN(plate) && plate > 0) {
        let plates = this.get('model.plates').slice();
        plates.push(plate);
        plates.sort((a, b) => a - b);
        this.set('model.plates', plates);
      }

      this.set('newPlateValue', '');
    }
  }
});