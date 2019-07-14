import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'settings-lifts-control' ],

  editingLifts: false,

  actions: {
    showEdit() {
      this.set('editingLifts', true);
    },
    saveEdit() {
      this.set('editingLifts', false);
    },
    cancelEdit() {
      this.set('editingLifts', false);
    }
  }
});
