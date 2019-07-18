import DS from 'ember-data';
const { Model, attr, hasMany } = DS;

export default Model.extend({
  name: attr('string'),
  max: attr('number'),
  userId: attr('string'),
  completedWorkouts: hasMany('completed-workout')
});