import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('week', { path: 'week/:week_id' });
  this.route('lift', { path: 'lift/:week_id/:lift_id'});
});

export default Router;
