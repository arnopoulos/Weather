/*
	Function: loadStatesData

	Loads JSON data for states asynchronously.

	Parameters:

		callback - A function that is called after the ajax call is complete.
*/
function loadStatesData(callback) {
	$.ajax({
		url: "states.json",
		dataType: "json",
		beforeSend: function( xhr ) {
			var mimeType = "text/plain; charset=x-user-defined";
			xhr.overrideMimeType(mimeType);
		}

	}).done(callback);
}

/*
	Function: getTemperature

	Given a city and a state the function loads the data from openweathermap.org and passes it
	to the callback.

	Parameters:

		city - A city name string
		state - A state name string
		callback - A function that is called after the ajax call is complete.
*/
function getTemperature(city, state, callback) {
	var htmlParameters = {q : city + " " + state, appid: "d07e35bf4e0f47061008faea6d5959ac"}
	$.ajax({
		url:"http://api.openweathermap.org/data/2.5/weather",
		type:'GET',
		dataType: "jsonp",
		data:htmlParameters,
		success:callback
	});
}

/*
	Function: colorForTemperature

	The function provides a color that ranges from #000000 to #FF00FF. When a cold value is
	passed the function returns a blue-like color. When a hot value is passed the function
	returns a red-like color.

	Parameters:
		temperature - The temperature in fahrenheit.

	Returns:
		A string that represents a color value that can be passed as a css value.
*/
function colorForTemperature(temperature) {
	var lowestTemperature = -60; //Lowest temperature is actually -130
	var highestTemperature = 134;

	var distance = Math.abs(lowestTemperature) + Math.abs(highestTemperature);
	var offsetTemperature = temperature - lowestTemperature;

	var blue = Math.round(((distance - offsetTemperature) / distance) * 255);
	var red = Math.round((offsetTemperature / distance) * 255);
	var color = "#" + red.toString(16) + "00" + blue.toString(16)

	console.log(color);
	return color
}

/*
	Function: toFahrenheit

	Converts a temperature in kelvin to fahrenheit.

	Parameters:
		kelvin - A temperature in kelvins.

	Returns:
		A number that represents the kelvin parameter in fahrenheit.
*/
function toFahrenheit(kelvin) {
	return (kelvin-273.15) * 9/5 + 32
}

/*
	Function: generateStateColorChangeCallback

	Creates a callback to change the color of a particular state.

	Parameters:
		tag - A html tag  

	Returns:
		A function that can be used as a callback for an ajax call.
*/
function generateStateColorChangeCallback(tag) {
	var callback = function(response) {
		if (response.cod == 200) {
			var temp = toFahrenheit(response.main.temp);
			var color = colorForTemperature(temp);
			tag.css("fill",color);
		} else {
			$("#"+data.id).css("fill","black");
		}
	}
	return callback;
}

/*
	Function: getTemperatureWithStateData

	Convenience function for getTemperature. This function gets the corresponding element from
	the DOM, creates the callback for that element and calls getTemperature.

	Parameters:
		stateData - A JSON object that represents the data corresponding to a state.
					Ex: {"id":"CO", "state":"Colorado", "stateAbbreviation":"CO", "capital":"Denver"}
*/
function getTemperatureWithStateData(stateData) {
	var stateElement = $("#"+stateData.id);
	var callback = generateStateColorChangeCallback(stateElement);
	var state = stateData.state;
	var capital = stateData.capital;
	getTemperature(capital, state, callback);
}

/*
	Function: loadTemperatures

	A function that takes a list of state objects and gets the temperatures.

	Parameters:
		statesData - An array of stateData objects.
*/
function loadTemperatures(statesData) {
	statesData.forEach(function(state) {
		getTemperatureWithStateData(state);
	});
}

// Load states and temperatures once the DOM is done loading.
$(document).ready(function() {
	loadStatesData(loadTemperatures);
});