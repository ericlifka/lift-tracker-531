import Component from '@ember/component';
import { computed } from '@ember/object';
import { oneRepEstimate } from '../utils/one-rep-estimate';

let _months_ = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default Component.extend({
  classNames: [ 'record-editor' ],
  classNameBindings: [ 'deleted:deleted' ],

  editing: false,
  deleted: false,

  displayDate: computed('record.date', function () {
    let date = new Date(this.get('record.date'));
    let day = date.getDate();
    let month = _months_[ date.getMonth() ];

    return `${month} ${day}`;
  }),

  actions: {
    edit() {
      this.set('editing', true);
    },

    save() {
      let record = this.get('record');
      console.log('start-date', record.get('date'), record.get('id'));
      let newEstimate = oneRepEstimate(record.get('weight'), record.get('reps'));
      record.set('date', new Date(record.get('date')));
      record.set('estimatedMax', newEstimate);

      record.save().then(() => {
        console.log('end-date', record.get('date'));
        this.set('editing', false)
      });
    },

    delete() {
      let record = this.get('record');
      record.deleteRecord();
      record.save().then(() => {
        this.set('editing', false);
        this.set('deleted', true);
      });
    }
  }
});