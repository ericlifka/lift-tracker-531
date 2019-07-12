import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  email: "eric.lifka@gmail.com",
  password: "test1234",

  actions: {
    login(email, password) {
      return this.get('session').authenticate('authenticator:firebase', { email, password })
        .then(() => this.transitionToRoute('index'));
    }
  }
});