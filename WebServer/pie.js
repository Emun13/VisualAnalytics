// Contains all the functions related to the pie chart
// Get all the column names for each data set.
sensor_cols = Object.keys(SENSOR_DATA["0"])
meteor_cols = Object.keys(METEOR_DATA["0"])
console.log(sensor_cols);

// Grab all data from a specified sensor.
function filter_data(sensor, months, weeks) {
  // Return the empty array if no months are specified.
  if (months.length == 0 || weeks.length == 0) {
    return [];
  }
  const data = []
  var week_ranges = []
  weeks.forEach(week => {
    week_ranges.push([((week - 1) * 7) + 1, week * 7]);
  })
  for (var key in SENSOR_DATA) {
    var curr_sensor = SENSOR_DATA[key]['Monitor'];
    var curr_date   = new Date(SENSOR_DATA[key]['Date']);
    var curr_month  = curr_date.getUTCMonth() + 1;
    var curr_day    = curr_date.getUTCDate();
    if (curr_sensor == sensor && months.includes(curr_month)) {
      for (var x in week_ranges) {
        var start = week_ranges[x][0];
        var end   = week_ranges[x][1];
        if (curr_day >= start && curr_day <= end) {
          data.push(SENSOR_DATA[key]);
          break;
        }
      }
    }
  }
  return data;
}

// Grab all the existing sensors and chemicals
// that exist with our dataset. This is to avoid
// hardcoding information.
var sensor_1 = filter_data(1, [4, 8, 12], [1, 2, 3, 4, 5]);
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
function generate_pie_chart(sensor, months) {
  pieChart = new Chart(document.getElementById("pieChart"), {
    type: 'pie',
    data: {
      labels: Array.from(CHEMICALS).sort(),
      datasets: [{
        label: 'Sensor ' + sensor,
        data: get_chemical_avgs(filter_data(sensor, months)),
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
function update_pie_chart(chart, sensor, months, weeks) {
  chart.data.datasets[0].data = get_chemical_avgs(filter_data(sensor, months, weeks));
  chart.update();
}

// Redraw pie chart on change of sensor.
function redraw(start, end) {
  // Grab all of the values that a user could have changed.
  var sensor = document.getElementById("sensor-num").value;
  var april = document.getElementById("april").checked;
  var august = document.getElementById("august").checked;
  var december = document.getElementById("december").checked;
  var w1 = document.getElementById("W0").checked;
  var w2 = document.getElementById("W1").checked;
  var w3 = document.getElementById("W2").checked;
  var w4 = document.getElementById("W3").checked;
  var w5 = document.getElementById("W4").checked;

  // Append only the months that have been checked.
  var months = [];
  var weeks = [];
  if (april) {
    months.push(4);
  }
  if (august) {
    months.push(8);
  }
  if (december) {
    months.push(12);
  }
  for (var i = 0; i < 5; i++) {
    if (document.getElementById(`W${i}`).checked) {
      weeks.push(i + 1);
    }
  }
  console.log(weeks);

  update_pie_chart(pieChart, sensor, months, weeks);
}
