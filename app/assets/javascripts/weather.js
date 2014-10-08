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
				units: "ca"
			},
			success: function( response ) {
				$('#summary').text(response.currently.summary);
				$('#sunrise').text(convertTimezone(response.daily.data[0].sunriseTime * 1000));
				$('#sunset').text(convertTimezone(response.daily.data[0].sunsetTime * 1000));
				$('#weather-img').attr("src", "/images/icons/" + response.currently.icon + ".png");
				$('#windspeed').text(response.currently.windSpeed + " km/h");
				$('#cloudcover').text(response.currently.cloudCover * 100 + "%");
				$('#humidity').text(response.currently.humidity * 100 + "%");
				$('#rainchance').text(response.currently.precipProbability * 100 + "%");
				$('#apptemperature').text(response.currently.apparentTemperature + " °C");
				$('#temperature').text(response.currently.temperature + " °C");
				$('#maxtemperature').text(response.daily.data[0].temperatureMax + " °C");
				$('#mintemperature').text(response.daily.data[0].temperatureMin + " °C");
				function formatLocation(location) {
					var decimals = location - Math.floor(location);
					var minutes = Math.floor(decimals * 60);
					return Math.floor(location) + "°" + minutes + "'";
				}
				$('#latitude').text((response.latitude > 0)? formatLocation(response.latitude) + " N":formatLocation(-1 * response.latitude) + " S");
				$('#longitude').text((response.longitude > 0)? formatLocation(response.longitude) + " E":formatLocation(-1 * response.longitude) + " W");
				$('#timezone').text(response.timezone);
				$('#localtimezone').text((((-1 * (new Date).getTimezoneOffset()/60) < 0)?(-1 * (new Date).getTimezoneOffset()/60):"+"+(-1 * (new Date).getTimezoneOffset()/60)) + " GMT");
				$('#offset').text(((response.offset < 0)?response.offset:"+"+response.offset) + " GMT");
				$('#currenttime').text(response.currently.time);

				function convertTimezone(d) {
					var current = new Date(d);
					var currenttime = current.getTime();
					var offset = current.getTimezoneOffset() * 60000;
					var utctime = currenttime + offset;
					var locationTime = utctime + (3600000 * response.offset);
					var location = new Date(locationTime);
					return location.toLocaleTimeString();
				}

				function clock() {
					var d = new Date();
					$('#localtime').text(d.toLocaleTimeString());
					$('#currenttime').text(convertTimezone(d));
					cleartime = setTimeout(clock, 1000);
				}
				clock();
				console.log( response.currently );
				console.log( response ); // server response
			}
		});
	}
});