// Some helpful functions.

/* Given a sensor number, this returns all the data that
 * involves that sensor number. The return is an array.
 */
function data_from_sensor(sensor) {
    const data = []
    for (var key in SENSOR_DATA) {
      if (SENSOR_DATA[key]['Monitor'] == sensor) {
        data.push(SENSOR_DATA[key]);
      }
    }
    return data;
}

// Get all the unique sensors and chemicals from
// our dataset.
const CHEMICALS = new Set()
var SENSORS   = new Set()
for (var key in SENSOR_DATA) {
  CHEMICALS.add(SENSOR_DATA[key]['Chemical']);
  SENSORS.add(SENSOR_DATA[key]['Monitor']);
}
SENSORS = Array.from(SENSORS).sort();

/* Given an array of data d, return the chemical averages
 * as an array. The chemical averages map 1-to-1 to the order
 * dictated by the CHEMICALS variable.
 */
function get_chemical_avgs(d) {
  // `chem_readings` will be a dictionary keyed by 
  // the chemical and valued by an array of readings.
  var chem_readings = {}
  CHEMICALS.forEach(chemical => {
    chem_readings[chemical] = []
  })


  d.forEach(element => {
    chemical = element['Chemical'];
    reading = element['Reading'];
    chem_readings[chemical].push(reading);
  })
  const chem_avgs = [];
  // Given an array of numbers, return the average.
  function calculate_avg(data) {
    len = data.length;
    return data.reduce((a, b) => a + b) / len
  }

  CHEMICALS.forEach(chemical => {
    avg = calculate_avg(chem_readings[chemical])
    chem_avgs.push(avg);
  })
  console.log(chem_avgs);
  return chem_avgs;
}

METH_COLOR   = 'rgb(255,99,132)' // pink
CHLORO_COLOR = 'rgb(54,162,235)' // blue
AGOC_COLOR   = 'rgb(255,205,86)' // yellow
APP_COLOR    = 'rgb(100,50,200)' // purple

