import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  username: "eric.lifka@gmail.com",
  password: "test1234",

  actions: {
    login(username, password) {
      return this.get('session').authenticate('authenticator:firebase', { username, password })
        .then(() => this.transitionToRoute('index'));
    }
  }
});