import { calcPlates, roundToFactor } from './plate-math';

export const WEEK_SPECS = {
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

export const WEEK_IDS = Object.keys(WEEK_SPECS).filter(i => i !== 'warmup');

export const getWorkoutSpec = weekId =>
WEEK_SPECS[ weekId ] || WEEK_SPECS[ 'warmup' ]

export const applyWorkoutSpec =
  (week, max, bar, userPlates, roundingFactor, spec = getWorkoutSpec(week)) =>
    spec.map(movement => {
      let appliedWeight = roundToFactor(movement.percent * max, roundingFactor);
      let weight = Math.max(appliedWeight, bar);
      let plates = calcPlates(userPlates, weight - bar);

      return { ...movement, weight, plates };
    });
