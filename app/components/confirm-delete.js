import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'confirm-delete' ],

  showConfirm: false,

  actions: {
    click() {
      if (!this.get('showConfirm')) {
        this.set('showConfirm', true);
      } else {
        this.set('showConfirm', false);
        this.deleteAction();
      }
    }
  }
});