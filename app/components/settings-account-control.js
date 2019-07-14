import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: [ 'settings-account-control' ],

  session: service(),

  actions: {
    signOut() {
      return this.get('session').invalidate();
    }
  }
});
