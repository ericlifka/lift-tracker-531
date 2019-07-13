import DS from 'ember-data';
const { Model, attr } = DS;

export default Model.extend({
  bar: attr('number'),
  rounding: attr('number'),
  plates: attr()
});