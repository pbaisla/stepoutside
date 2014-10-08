$(function() {
	var cleartime;
	var addresspicker = $( "#search" ).addresspicker({
	  updateCallback: showCallback
	});

	function showCallback(geocodeResult, parsedGeocodeResult){
		console.log("In showCallback");
		clearTimeout(cleartime);
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
				console.log("/images/icons/" + response.currently.icon + ".png");
				$('#weather-img').attr("src", "/images/icons/" + response.currently.icon + ".png");
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
				$('#localtimezone').text( -1 * (new Date).getTimezoneOffset()/60);
				$('#offset').text(response.offset);
				$('#currenttime').text(response.currently.time);

				function clock() {
					var current = new Date();
					$('#localtime').text(current.toLocaleTimeString());
					var currenttime = current.getTime();
					var offset = current.getTimezoneOffset() * 60000;
					var utctime = currenttime + offset;
					var locationTime = utctime + (3600000 * response.offset);
					console.log(utctime+ " " + response.offset +" "+locationTime);
					var location = new Date(locationTime);
					$('#currenttime').text(location.toLocaleTimeString());
					cleartime = setTimeout(clock, 1000);
				}
				clock();
				console.log( response.currently );
				console.log( response ); // server response
			}
		});
	}
});