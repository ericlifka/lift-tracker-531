export function runMigrations(data) {
  switch (data.schemaVersion) {
    case 0: data = m0(data);
    case 1: data = m1(data);
    default:
  }
  return data;
}

function m0(data) {
  return {
    schemaVersion: 1,
    lifts: [
      { name: "squat", max: 85 },
      { name: "bench", max: 65 },
      { name: "deadlift", max: 100 },
      { name: "press", max: 45 }
    ]
  };
}

function m1(data) {
  return {
    ...data,
    schemaVersion: 2,
    specifications: {
      bar: 45,
      round: 5,
      plates: [ 2.5, 5, 10, 25, 35, 45 ]
    }
  }
}
