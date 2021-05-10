// Contains all the functions related to the pie chart
// Get all the column names for each data set.
sensor_cols = Object.keys(SENSOR_DATA["0"])
meteor_cols = Object.keys(METEOR_DATA["0"])

// TODO(jhuang09): Incorporate filtered_data variable for this
// function. :)
// Grab all data from a specified sensor.
function filter_datap(sensor, start, end) {
  // Return the empty array if no months are specified.
  const data = []
  function add_days(date, days) {
    date.setDate(date.getDate() + days);
    return date;
  }
  var strict_end = add_days(end, 1);
  for (var key in SENSOR_DATA) {
    var curr_sensor = SENSOR_DATA[key]['Monitor'];
    var curr_date   = new Date(SENSOR_DATA[key]['Date']);
    var curr_month  = curr_date.getUTCMonth() + 1;
    var curr_day    = curr_date.getUTCDate();
    if (curr_sensor == sensor && curr_date >= start && curr_date < strict_end) {
        data.push(SENSOR_DATA[key]);
    }
  }
  return data;
}

// Grab all the existing sensors and chemicals
// that exist with our dataset. This is to avoid
// hardcoding information.
var sensor_1 = filter_datap(1, new Date(2016, 3, 1), new Date(2016, 11, 31));
var CHEMICALS = new Set()
var SENSORS   = new Set()
for (var key in SENSOR_DATA) {
  CHEMICALS.add(SENSOR_DATA[key]['Chemical']);
  SENSORS.add(SENSOR_DATA[key]['Monitor']);
}
SENSORS = Array.from(SENSORS).sort();
CHEMICALS = Array.from(CHEMICALS).sort();
// This will store our chart for creating and updating.
var pieChart;

// Given an array of data, return an array of average 
// readings. The order of each readings correspond to the
// chemical order in CHEMICALS.
function get_chemical_avgs(d) {
  var chem_readings = {}
  CHEMICALS.forEach(chemical => {
    chem_readings[chemical] = []
  })
  // Return an array in which all the averages are the same
  // if there is no data to parse.
  if (d.length == 0) {
    return Array(4).fill(1);
  }
  // Split the data by chemicals.
  d.forEach(element => {
    chemical = element['Chemical'];
    reading = element['Reading'];
    chem_readings[chemical].push(reading);
  })

  const chem_avgs = [];
  // Caculate the average given an array of numbers.
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

// Create the first pie chart. This pie chart will have no
// data in it. It will display all chemicals equally.
function generate_pie_chart(sensor) {
  pieChart = new Chart(document.getElementById("pieChart"), {
    type: 'pie',
    data: {
      labels: Array.from(CHEMICALS).sort(),
      datasets: [{
        label: 'Sensor ' + sensor,
        data: get_chemical_avgs(filter_datap(sensor, new Date(2016, 3, 1), new Date(2016, 11, 31))),
        backgroundColor: [
          'rgb(75,192,192)',
          'rgb(255,206,86)',
          'rgb(54,162,235)',
          'rgb(255,99,132)',
        ],
      }],
      hoverOffset: 4,
    },
    options : {
      legend: {
        display: false,
      },
      plugins: {
        legend : {
          labels : {
            color : "white"
          },
        },
      },
    },
  })
}

// Update pie chart with that matches the sensor and months selected
function update_pie_chart(chart, sensor, start, end) {
  var x = get_chemical_avgs(filter_datap(sensor, start, end));
  chart.data.datasets[0].data = x; 
  chart.update();
}

// Redraw pie chart on change of sensor.
function redraw(start, end, sensor) {
  update_pie_chart(pieChart, sensor, start, end);
}

function redraw_piechart() {
  var sensor = document.getElementById("sensor-num").value;
  var re = new RegExp('(.+) ,(.+)');
  var vals = slider.getValue();
  var matches = vals.match(re);
  var start_str = matches[1].concat(" 2016")
  var end_str = matches[2].concat(" 2016")
  var start = new Date(start_str)
  var end   = new Date(end_str)
  redraw(start, end, sensor)
}

