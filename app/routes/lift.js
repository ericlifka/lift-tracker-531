import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),

  model({ week_id, lift_id }) {
    return this.store.getWorkoutsModel(week_id, lift_id);
  }
});