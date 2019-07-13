import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { capitalize } from '../helpers/capitalize';

export default Route.extend(AuthenticatedRouteMixin, {
  store: service(),
  wendler: service(),

  model({ week_id, lift_id }) {
    return this.store.find('lift', lift_id)
      .then(lift => {
        let sets = this.wendler.createWorkout(week_id, lift.get('max'));
        let title = `${capitalize([lift.get('name')])} ${capitalize([week_id])}`;

        return { title, sets };
      })
  }
});