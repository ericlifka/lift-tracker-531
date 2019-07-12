import Base from 'ember-simple-auth/authenticators/base';
import firebase from 'firebase/app';
import { resolve, reject } from 'rsvp';

export default Base.extend({
  restore(data) {
    // I guess this works? idk
    if (firebase.auth().currentUser) {
      return resolve(data);
    } else {
      return reject(false);
    }
  },

  authenticate({ email, password }) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        let { email, refreshToken } = user;
        return {email, refreshToken};
      });
  },

  invalidate() {
    return firebase.auth().signOut()
  }
});