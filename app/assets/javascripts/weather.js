$(function() {
	var addresspicker = $( "#search" ).addresspicker({
	  updateCallback: showCallback
	});

	function showCallback(geocodeResult, parsedGeocodeResult){
		console.log("In showCallback");
	  	var latitude = parsedGeocodeResult.lat;
	  	var longitude = parsedGeocodeResult.lng;
	  	$.ajax({
			url: "https://api.forecast.io/forecast/71912c666bb4f17717079ae55a769f86/" + latitude + "," + longitude,
			jsonp: "callback",
			dataType: "jsonp",
			data: {
				units: "si"
			},
			success: function( response ) {
				$('#summary').text(response.currently.summary);
				$('#sunrise').text(response.daily.sunriseTime);
				$('#sunset').text(response.daily.sunsetTime);
				$('#icon').text(response.currently.icon);
				$('#windspeed').text(response.currently.windSpeed);
				$('#cloudcover').text(response.currently.cloudCover);
				$('#humidity').text(response.currently.humidity);
				$('#pressure').text(response.currently.pressure);
				$('#rainchance').text(response.currently.precipProbability);
				$('#apptemperature').text(response.currently.apparentTemperature);
				$('#temperature').text(response.currently.temperature);
				$('#maxtemperature').text(response.daily.temperatureMax);
				$('#mintemperature').text(response.daily.temperatureMin);
				$('#latitude').text(response.latitude);
				$('#longitude').text(response.longitude);
				$('#timezone').text(response.timezone);
				$('#offset').text(response.offset);
				console.log( response.currently );
				console.log( response ); // server response
			}
		});
	}
});