import { hash, resolve } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  store: service(),
  session: service(),
  wendler: service(),

  model() {
    return hash({
      email: resolve(this.session.get('data.authenticated.user.email')),
      lifts: this.store.query('lift', {
        filter: {
          userId: this.session.get('data.authenticated.user.uid')
        }
      }),
      barLoading: this.wendler.getBarLoading()
    });
  }
});