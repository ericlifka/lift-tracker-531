import Service from '@ember/service';
import { Promise } from 'rsvp';

export default Service.extend({
  getWorkouts(weekId, liftId) {
    return new Promise(resolve => {
      resolve({ week: weekId, lift: liftId });
    });
  }
});
