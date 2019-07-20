import Controller from '@ember/controller';

export default Controller.extend({
  chartOptions: {
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
  }
});
