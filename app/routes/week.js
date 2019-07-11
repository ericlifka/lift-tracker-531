import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),

  model(params) {
    return this.get('store')
      .getLiftsModel()
      .then(lifts => ({
        lifts,
        week: params.week_id
      }));
  }
});