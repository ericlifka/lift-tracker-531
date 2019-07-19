import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const allComplete = (week, lifts) =>
  lifts.reduce((accumulator, lift) => accumulator && lift.get(week), true)

export default Route.extend(AuthenticatedRouteMixin, {
  wendler: service(),

  model() {
    return hash({
      weekIds: this.wendler.getWeeks(),
      lifts: this.wendler.getLifts()
    })
    .then(({ weekIds, lifts }) => {
      let weeks = weekIds.map(week => ({
        name: week,
        isCompleted: allComplete(week, lifts)
      }));

      return { lifts, weeks };
    });
  }
});