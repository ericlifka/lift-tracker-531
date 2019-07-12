import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  store: service(),

  model({week_id}) {
    return this.store.getLiftsModel()
      .then(lifts => ({ lifts, week: week_id }));
  }
});