import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import { capitalize } from '../helpers/capitalize';

export default Route.extend(AuthenticatedRouteMixin, {
  store: service(),
  wendler: service(),

  model({ week_id, lift_id }) {
    return hash({
      lift: this.store.find('lift', lift_id),
      barLoading: this.wendler.getBarLoading()
    })
    .then(({ lift, barLoading }) => {
      let sets = this.wendler.createWorkout(week_id, lift.get('max'), barLoading);
      let title = `${capitalize([lift.get('name')])} ${capitalize([week_id])}`;

      return { title, sets };
    });
  }
});