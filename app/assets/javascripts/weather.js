$(function() {
	var addresspicker = $( "#search" ).addresspicker({
	  updateCallback: showCallback
	});

	function showCallback(geocodeResult, parsedGeocodeResult){
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
				$('#temperature').text(response.currently.temperature);
				$('#timezone').text(response.timezone);
				console.log( response.currently.timezone );
				console.log( response.currently.temperature ); // server response
			}
		});
	}
});