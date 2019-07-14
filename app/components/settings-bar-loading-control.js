import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'settings-bar-loading-control' ],

  editing: false,

  commonBarWeights: [ 15, 25, 35, 45, 55 ],
  commonRoundingThresholds: [ 1, 2.5, 5, 10 ],

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
    }
  }
});