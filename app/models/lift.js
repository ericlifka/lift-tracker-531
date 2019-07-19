import DS from 'ember-data';
const { Model, attr, hasMany } = DS;

export default Model.extend({
  name: attr('string'),
  max: attr('number'),
  userId: attr('string'),
  completedWorkouts: hasMany('completed-workout'),
  '5-5-5': attr('boolean'),
  '3-3-3': attr('boolean'),
  '5-3-1': attr('boolean'),
  'deload': attr('boolean')
});