import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),

  model({week_id}) {
    return this.store.getLiftsModel()
      .then(lifts => ({ lifts, week: week_id }));
  }
});