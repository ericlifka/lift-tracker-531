import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  store: service(),
  session: service(),

  model({ week_id }) {
    let userId = this.session.get('data.authenticated.user.uid');

    return this.store.query('lift', { filter: { userId } })
      .then(lifts => ({
        lifts, week: week_id
      }));
  }
});