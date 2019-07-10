export function load(key) {
  let blob = localStorage.getItem(key);
  if (!blob) {
    console.warn(`No data found for key '${key}', defaulting to empty data set.`)
    blob = `{"schemaVersion":0}`;
  }

  let data;
  try {
    data = JSON.parse(blob);
  } catch (e) {
    console.warn('Error parsing data blob, defaulting to empty data set.', e, blob);
    data = {schemaVersion:0};
  }

  return data;
}