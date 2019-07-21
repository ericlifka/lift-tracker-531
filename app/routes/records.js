import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  model() {
    return this.store.query('completed-workout', {
      filter: {
        userId: this.session.get('data.authenticated.user.uid')
      }
    }).then(records => {
      return records.toArray().sort((l, r) =>
        new Date(r.get('date')) - new Date(l.get('date')));
    });
  }
});
