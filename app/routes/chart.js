import { all } from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const chartOptions = {
  chart: {
    type: 'line',
    height: "600px"
  },
  title: {
    text: ''
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
    }
  },
  tooltip: {
    headerFormat: '<b>{series.name}</b><br>{point.x:%e. %b}<br>',
    pointFormat: 'lifted:{point.weight}lbs x{point.reps}<br>1 rep: {point.y}lbs'
  },
  plotOptions: {
    line: {
      animation: {
        duration: 0
      },
      dataLabels: {
        enabled: true,
        align: "center",
        formatter() {
          return this.y;
        },
        padding: 3,
        style: {
          fontSize: "10px",
          fontWeight: "normal",
          color: "contrast",
          textOutline: "2px contrast"
        },
        verticalAlign: "bottom",
        x: 0,
        y: 0
      },
      lineWidth: 3,
      marker: {
        enabled: true,
        symbol: "circle"
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
