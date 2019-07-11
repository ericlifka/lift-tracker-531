import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  store: service(),

  actions: {
    increaseLift(liftId) {
      this.store.updateMax(liftId, 5);
    },

    decreaseLift(liftId) {
      this.store.updateMax(liftId, -5);
    }
  }
});