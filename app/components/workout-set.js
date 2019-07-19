import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'workout-set' ],
  classNameBindings: [ 'isCompleted:complete' ]
});