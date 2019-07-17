export const oneRepEstimate = (weight, reps) => Math.round(
  weight * ( 1 + Math.min(reps, 12) / 30 )
)