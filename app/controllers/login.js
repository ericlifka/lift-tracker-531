import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  email: "",
  password: "",

  actions: {
    login(email, password) {
      return this.get('session').authenticate('authenticator:firebase', { email, password })
    }
  }
});