import Controller from '@ember/controller';
import { set } from '@ember/object';

export default Controller.extend({
  actions: {
    clearCompleted() {
      this.get('model.weeks').forEach(week => {
        set(week, 'isCompleted', false);
      });
    }
  }
});
