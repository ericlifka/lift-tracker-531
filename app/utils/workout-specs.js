import { calcPlates, roundToFactor } from './plate-math';

export const week_specs = {
  'warmup': [
    { percent: .4, reps: 5 },
    { percent: .5, reps: 5 },
    { percent: .6, reps: 3 }
  ],
  '5-5-5': [
    { percent: .65, reps: 5 },
    { percent: .75, reps: 5 },
    { percent: .85, reps: 5, plusSet: true }
  ],
  '3-3-3': [
    { percent: .7, reps: 3 },
    { percent: .8, reps: 3 },
    { percent: .9, reps: 3, plusSet: true }
  ],
  '5-3-1': [
    { percent: .75, reps: 5 },
    { percent: .85, reps: 3 },
    { percent: .95, reps: 1, plusSet: true }
  ],
  'deload': [
    { percent: .4, reps: 5 },
    { percent: .5, reps: 5 },
    { percent: .6, reps: 5 }
  ]
};

export const getWorkoutSpec = weekId =>
  week_specs[ weekId ] || week_specs[ 'warmup' ]

export const applyWorkoutSpec =
  (week, max, bar, userPlates, roundingFactor, spec = getWorkoutSpec(week)) =>
    spec.map(movement => {
      let appliedWeight = roundToFactor(movement.percent * max, roundingFactor);
      let weight = Math.max(appliedWeight, bar);
      let plates = calcPlates(userPlates, weight - bar);

      return { ...movement, weight, plates };
    });
