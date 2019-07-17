import DS from 'ember-data';
const { Model, attr } = DS;

export default Model.extend({
  userId: attr('string'),
  date: attr('date'),
  weight: attr('number'),
  reps: attr('number'),
  estimatedMax: attr('number')
});