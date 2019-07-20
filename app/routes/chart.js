import { all } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const chartOptions = {
  chart: {
    type: 'spline'
  },
  title: {
    text: '1 Rep Max Estimates'
  },
  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: {
      month: '%e. %b',
      year: '%b'
    },
    title: {
      text: ''
    }
  },
  yAxis: {
    title: {
      text: ''
    },
    min: 0
  },
  tooltip: {
    headerFormat: '<b>{series.name}</b><br>{point.x:%e. %b}<br>',
    pointFormat: 'lifted:{point.weight}lbs x{point.reps}<br>1 rep: {point.y}lbs'
  },
  plotOptions: {
    spline: {
      marker: {
        enabled: true
      }
    }
  }
};

export default Route.extend({
  wendler: service(),

  model() {
    return this.wendler.getLifts().then(liftsRecords => {
      let recordsPromises = liftsRecords.map(lift => lift.get('completedWorkouts'));

      return all(recordsPromises).then(workoutLiftRecords => {
        let lifts = liftsRecords.toArray();
        let series = [ ];

        for (let i = 0; i < lifts.length; i++) {
          let lift = lifts[ i ];
          let data = workoutLiftRecords[ i ];

          data = data
            .map(record => record.getProperties('date', 'estimatedMax', 'weight', 'reps'))
            .map(({ date, estimatedMax, weight, reps }) => ({
              x: new Date(date),
              y: estimatedMax,
              weight, reps
            }))
            .sort((l, r) => l.x - r.x)

          series.push({ data, name: lift.get('name') });
        }

        return {
          chartOptions,
          series
        };
      });
    });
  }
});
