import { hash, resolve } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  store: service(),
  session: service(),
  wendler: service(),

  model() {
    let userId = this.session.get('data.authenticated.user.uid');
    let email = this.session.get('data.authenticated.user.email');

    return hash({
      email: resolve(email),
      lifts: this.store.query('lift', { filter: { userId } }),
      barLoading: this.wendler.getBarLoading()
    });
  }
});