export function calcPlates(plates, remaining) {
  if (plates.length === 0 || remaining <= 0) {
    return [];
  }
  let [ largest, ...rest ] = plates;
  if (2 * largest > remaining) {
    return calcPlates(rest, remaining);
  }
  else {
    return [ largest, ...calcPlates(plates, remaining - (2 * largest)) ];
  }
}

export const roundToFactor =
  (weight, factor = 5, half = factor / 2) =>
    factor * Math.floor( (weight + half) / factor )
