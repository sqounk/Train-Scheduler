
  var config = {
    apiKey: "AIzaSyAiZNnx-07dXRh2zAG8pkzyW-LWtU3PtJ0",
    authDomain: "sqounk-train-scheduler.firebaseapp.com",
    databaseURL: "https://sqounk-train-scheduler.firebaseio.com",
    projectId: "sqounk-train-scheduler",
    storageBucket: "sqounk-train-scheduler.appspot.com",
    messagingSenderId: "529041171590"
  };
  firebase.initializeApp(config);

var database = firebase.database();


$(document).ready(function(){

	setInterval(function(){
		var currentTime = moment().format('h:mm:ss a');
		var timeDisplay = $('<h1>').html(currentTime);
		$('#timeDisplay').html(timeDisplay);
	}, 1000);

	$('#submit').on('click', function(){
		event.preventDefault();
		var trainName = $('#trainName').val().trim();
		var destination = $('#destination').val().trim();
		var firstTrain = $('#firstTrain').val().trim();
		var frequency = $('#frequency').val().trim();

		database.ref().push({
			trainName: trainName,
			destination: destination,
			firstTrain: firstTrain,
			frequency: frequency
		});
	});

	database.ref().on("child_added", function(snapshot) {
		var data = snapshot.val();
		var trainName = data.trainName;
		var destination = data.destination;
		var firstTrain = data.firstTrain;
		var frequency = data.frequency;
		var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
		var currentTime = moment();
		var timeDifference = currentTime.diff(moment(firstTrainConverted), "minutes");
		var tRemainder = timeDifference % frequency;
		var minutesAway = frequency - tRemainder;
		var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm a");
		$('#tbody').append("<tr>" +
								"<td id='table-trainName'> " + trainName + "</td>" +
								"<td id='table-destination'> " + destination + "</td>" +
					       	 	"<td id='table-frequency'> " + frequency + "</td>" +
					        	"<td id='next-train'> " + nextTrain + "</td>" +
					        	"<td id='minutes-away'>" + minutesAway + "</td>" +
				        	"</tr>");

	}, function(errorObject) {
		console.log("there was an error pulling data from the databse: " + errorObject.code);

		$("#form").trigger("reset");
	})

	 // $("#form").trigger("reset");
});