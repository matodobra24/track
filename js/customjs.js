
var appId = "2YKLmSHs3I0LTol9Dfewk14dIOM9JnmMdihk5Gra";
var jsKey = "PoOK5Ds7gtrkjTBD6yY5v3RImNRwQ69MY4U5096f";

console.log("hello world");


Parse.initialize(appId, jsKey); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "https://parseapi.back4app.com/";


function loadData(date) {

  var now = moment();

  var dateClicked = false //use this to set if the date has been clicked to reset the chart/table elements

  var totalOutTime = 0;
  var outTimeDisplay = "";
  var graphChartIn = 0;
  var graphChartOut = 0;

  var tripsOutOfQuarters = 0;

  var msDay = moment.duration(1, 'day').asMilliseconds();


  var startTime = "06:00:00";

  var	selectedDate = moment(date).format("MMM DD, YYYY HH:mm:ss");
  var addedDay = moment(selectedDate).add(1, 'day').format("MMM DD, YYYY");

  var searchDate = moment(selectedDate).format("MMM DD, YYYY");
  var addedSearchDay = moment(searchDate).add(1, 'day').format("MMM DD, YYYY");

  var shiftStart = searchDate + " " + startTime;
  var shiftEnd = moment(addedDay + " " + startTime).format("MMM DD, YYYY HH:mm:ss");

  var inTimeArray = [];
  var outTimeArray = [];


  var buttonDate = document.getElementById("button").getAttribute("data-date");
  console.log("The Date is: " + buttonDate);

  var tableInformation = document.getElementById("information");
  if (tableInformation) {
    console.log(tableInformation);
    tableInformation.innerHTML = "";
  };



var today = moment().format("MMM DD, YYYY");
console.log(today);
today = moment(today + " " + startTime).format("MMM DD, YYYY HH:mm:ss");

console.log("Selected Day: " + selectedDate +", " + "Today is :" + today);

  if (moment(selectedDate).isSame(today, 'day') || moment(now).isBetween(shiftStart , shiftEnd)) {
    //msday = time since 0600.

    msDay = moment(now).diff(today);

    console.log("time till now" + msDay);

  } else {

    console.log("The selected day is NOT TODAY");

  };

const MyCustomClass = Parse.Object.extend('InOutStatus');
const query = new Parse.Query(MyCustomClass);
const query2 = new Parse.Query(MyCustomClass);

query2.equalTo("date", addedSearchDay);
query2.equalTo("unit", "6301");
query.equalTo("unit", "6301");
query.equalTo("date", searchDate)

var mainQuery = Parse.Query.and(
  Parse.Query.or(query, query2)
);

mainQuery.find().then((results) => {

  console.log(results.length);
  tripsOutOfQuarters = results.length;

  for (i in results) {

    var outDate = 	results[i].get("date");
    var outTime = results[i].get("outTime");
    var inTime = results[i].get("inTime");
    var reason = results[i].get("reason");
    var inDate = results[i].get("inDate");

    //if inTime + Date are invalid, input time till now.

    if (inDate == "" && inTime == "") {
      console.log("THESE TIMES ARE INVALID, INTIME/INDATE");
    }

    //USE MOMENT.ISBETWEEN() FUNCTION

    //Captures the Start & the End time of each result in the row.

    var start = moment(outDate + " " + outTime).format("MMM DD, YYYY HH:mm:ss");
    var end = moment(inDate + " " + inTime).format("MMM DD, YYYY HH:mm:ss");

    //Subtracks the difference between the end and start time

    console.log(start);
    console.log(searchDate + " " + startTime);
    console.log(addedDay + " " + startTime);


    console.log("End Time: "+ shiftEnd);


    // if( moment(start).isBetween(searchDate + " " + startTime , addedDay + " " + "00:00:00") == true) {
    if( moment(start).isBetween(shiftStart , shiftEnd) == true) {

      if (inTimeArray.length == 0) {
        inTimeArray.push(shiftStart);
      };

      console.log("I: " + i + "results Length: " + results.length);

      inTimeArray.push(end);

      outTimeArray.push(start);

      if (outTimeArray.length ==  results.length) {

          outTimeArray.push(shiftEnd);

        console.log("did make it to loop");
      };

      console.log("Out Time Array: " + inTimeArray.length + "In time arrary: " + results.length )

      var milliseconds = moment(end).diff(start, 'milliseconds');
      console.log(milliseconds);

      var timeBetween = moment.duration(milliseconds);
      timeBetween = timeBetween.asHours();
      timeBetween =  Math.round(timeBetween * 100) / 100
      timeBetween = timeFormatter(timeBetween);

      //Adds the difference to running time

      totalOutTime = totalOutTime + milliseconds;
      console.log(totalOutTime);


      $('tbody#information').append('<tr><th scope="row">'+ outDate +'</th><td>'+ outTime +'</td><td>'+ inTime +'</td><td>'+ timeBetween +'</td></tr>');

      console.log("is between")

    } else {

      console.log("There are times out side of this scope");

    }
    i = i+1;
  }

  document.getElementById("tripsOut").innerHTML = "Trips Out: " + tripsOutOfQuarters;

  //The percentage out is the total running time
  var percentOut = totalOutTime/msDay;

  var percentIn = 100 - percentOut;

  //NEED TO CONVERT MSDAY TO HOURS TO DO CALCULATIONS
  var multiplier = moment.duration(msDay).asHours();

  //Calculate percentage into hours (may have to update 24 to accomidate Hold Over)
  var hoursOut = percentOut * multiplier;
  hoursOut = Math.round(hoursOut * 100) / 100;
  var displayHoursOut = timeFormatter(hoursOut);

  document.getElementById("hoursOut").innerHTML = "Hours Out: " + displayHoursOut;

  var timeOutFormatted = moment.duration(totalOutTime);
  timeOutFormatted = timeOutFormatted.asHours();
  timeOutFormatted =  Math.round(timeOutFormatted * 100) / 100
  console.log("as Hours: " + timeOutFormatted)

  console.log(timeOutFormatted);

  var avgTimeIn = timeOutFormatted / tripsOutOfQuarters;
  avgTimeIn = Math.round(avgTimeIn * 100) / 100;
  var displayAvgTimeIn = timeFormatter(avgTimeIn);

  document.getElementById("avgTimeIn").innerHTML = "Average Time In: " + displayAvgTimeIn;


  //IMPORTANT - NEED TO FIX DISPLAY FOR HOURS/TIME, INCORRECT
  var dailyPercentIn = 1 - percentOut;
  var hoursIn = dailyPercentIn * multiplier;
  hoursIn = Math.round(hoursIn * 100) / 100;
  var displayHoursIn = timeFormatter(hoursIn);

  document.getElementById("hoursIn").innerHTML = "Hours In: " + displayHoursIn;


  //Calculates display Percent
  var percentOutDisplay = Math.round(percentOut * 100) / 100;
  percentOutDisplay = percentOutDisplay * 100;
  percentOutDisplay = Math.round(percentOutDisplay * 100) / 100;

  document.getElementById("utilization").innerHTML = "Utilization: " + percentOutDisplay;

  //Calculates Hours
  var outTimeDisplay = Math.round(percentOut * 100) / 100;
  outTimeDisplay = outTimeDisplay * 100;

  var inTimeDisplay = Math.round(dailyPercentIn * 100) / 100;
  inTimeDisplay = inTimeDisplay * 100;

  graphChartOut = percentOut * 360;
  graphChartIn = 360 - graphChartOut;


console.log(percentOutDisplay);

  var canvas = $("#myCanvas");
  if (canvas) {

    var ctx = canvas.get(0).getContext("2d");
    ctx.canvas.width = canvas.width();
    ctx.canvas.height = canvas.height();

    console.log("has canvas");

  }

  console.log(inTimeArray);
  console.log(outTimeArray);

  var data = [
    {
      value: graphChartOut,
      color: "cornflowerblue",
      highlight: "lightskyblue",
      label: "Out of Quarters"
    },
    {
      value: graphChartIn,
      color: "lightgreen",
      highlight: "yellowgreen",
      label: "In Quarters"
    },

  ];

  //draw
  var piechart = new Chart(ctx).Doughnut(data);

});

}
function timeFormatter(time){
  var decimalTimeString = time;
  var decimalTime = parseFloat(decimalTimeString);
  decimalTime = decimalTime * 60 * 60;
  var hours = Math.floor((decimalTime / (60 * 60)));
  decimalTime = decimalTime - (hours * 60 * 60);
  var minutes = Math.floor((decimalTime / 60));
  decimalTime = decimalTime - (minutes * 60);
  var seconds = Math.round(decimalTime);
  if(hours < 10)
  {
    hours = "0" + hours;
  }
  if(minutes < 10)
  {
    minutes = "0" + minutes;
  }
  if(seconds < 10)
  {
    seconds = "0" + seconds;
  }
  return ("" + hours + ":" + minutes + ":" + seconds);
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}

function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

        csv.push(row.join(","));
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

$( function() {
  $('#button').datepicker()
  .on('changeDate', function(ev){
        $('#button').datepicker('hide');
        var buttonVal = ev.date.valueOf();
        buttonVal = moment(buttonVal).format("MMM DD, YYYY");
        selectedDate = buttonVal;
        console.log(buttonVal);

        loadData(buttonVal);

    });
});
