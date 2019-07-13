import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  store: service(),
  session: service(),

  model({week_id}) {
    return this.store.query('lift', {
      filter: {
        userId: this.session.get('data.authenticated.user.uid')
      }
    }).then(lifts => {
      return { lifts, week: week_id };
    });
  }
});