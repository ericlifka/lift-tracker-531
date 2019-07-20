import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  wendler: service(),

  model() {
    return this.wendler.getLifts();
  }
});
