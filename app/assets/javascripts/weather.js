$(function() {

	function converttemp(unit, temperature) {
		var t;
		if (unit == 0) { // Celcius - convert to fahrenheit
			t = (temperature * 9/5) + 32;
		}
		else {// Fahrenheit - convert to Celcius
			t = (temperature - 32) * 5/9;
		}
		t = Math.round(t*100)/100;
		return t;
	}

	$(".tchange").click(function() {
		$(".celcius").toggleClass("badge");
		$(".fahrenheit").toggleClass("badge");
		var unit; 
		var temp;
		 if($(".celcius").hasClass("badge")) {
		 	unit = 1;
		 	temp = "°C";
		 }
		 else {
		 	unit = 0;
		 	temp = "°F";
		 }
		var t = $("#temperature").text().substr(0,$("#temperature").text().indexOf(' '));
		$("#temperature").text( converttemp(unit, t) + " " + temp);
		var at = $("#apptemperature").text().substr(0,$("#apptemperature").text().indexOf(' '));
		$("#apptemperature").text( converttemp(unit, at) + " " + temp);
		var mt = $("#maxtemperature").text().substr(0,$("#maxtemperature").text().indexOf(' '));
		$("#maxtemperature").text( converttemp(unit, mt) + " " + temp);
		var mnt = $("#mintemperature").text().substr(0,$("#mintemperature").text().indexOf(' '));
		$("#mintemperature").text( converttemp(unit, mnt) + " " + temp);
		var tid, atid, mtid, mntid;
		for (var i = 0; i < 8; i++) {
			tid = "#temperature" + i;
			atid = "#apptemperature" + i;
			mtid = "#maxtemperature" + i;
			mntid = "#mintemperature" + i;
			t = $(tid).text().substr(0,$(tid).text().indexOf(' '));
			$(tid).text( converttemp(unit, t) + " " + temp);
			at = $(atid).text().substr(0,$(atid).text().indexOf(' '));
			$(atid).text( converttemp(unit, at) + " " + temp);
			mt = $(mtid).text().substr(0,$(mtid).text().indexOf(' '));
			$(mtid).text( converttemp(unit, mt) + " " + temp);
			mnt = $(mntid).text().substr(0,$(mntid).text().indexOf(' '));
			$(mntid).text( converttemp(unit, mnt) + " " + temp);
		};
		console.log(t+" "+at+" "+mt+" "+mnt+" "+$("#temperature").text().substr($("#temperature").text().indexOf(' ')+1)); 
	});

	if (window.location.pathname == "/forecast") {
		if ((gup("lat") != null) && (gup("lng") != null) && (gup("loc") != null)) {
			showForecastCallback(null, null, gup("lat"), gup("lng"), gup("loc"));
		}
		else {

		}
	}

	console.log($("#notice").text().search(/[a-z]/));

	if ($("#notice").text().search(/[a-z]/) == -1 ) {
		$("#notice").css("visibility", "hidden");
	}
	else
		$("#notice").delay(500).fadeOut(); 

	if ($("#alert").text().search(/[a-z]/) == -1 ) {
		$("#alert").css("visibility", "hidden");
	}
	else
		$("#alert").delay(2000).fadeOut();

	function gup( name )
	{
	  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	  var regexS = "[\\?&]"+name+"=([^&#]*)";
	  var regex = new RegExp( regexS );
	  var results = regex.exec( window.location.href );
	  if( results == null )
	    return null;
	  else
	    return results[1];
	}

	var cleartime;
	$("#see-more").click(function() {
		$("#more").slideToggle();
		if ($(this).text() == "More")
			$(this).text("Hide");
		else
			$(this).text("More");
	});
	var addresspicker = $( "#search" ).addresspicker({
	  updateCallback: showCallback
	});
	var addresspicker = $( "#forecastsearch" ).addresspicker({
	  updateCallback: showForecastCallback
	});

	function showCallback(geocodeResult, parsedGeocodeResult){
		function landing() {
			if ($("#main").css("display") == "none") {
				$("#landing").slideUp("slow", function() {
					$("#searchdiv").removeClass("col-sm-offset-3", "slow", function() {
						$("#main").fadeIn("slow");	
					});
				});
				$(".info").slideUp("slow");
			}
		}
		if ($(".fahrenheit").hasClass("badge")) {
			$(".fahrenheit").toggleClass("badge");
			$(".celcius").toggleClass("badge");
		}
		$(".card").fadeOut("slow", function() {
			$("#spinner").fadeIn("slow");
		});
		console.log("In showCallback");
		console.log(geocodeResult);
		console.log(parsedGeocodeResult);
		clearTimeout(cleartime);
	  	var latitude = parsedGeocodeResult.lat;
	  	var longitude = parsedGeocodeResult.lng;
	  	console.log("ajax time");
	  	$.ajax({
			url: "https://api.forecast.io/forecast/" + key + "/" + latitude + "," + longitude,
			jsonp: "callback",
			dataType: "jsonp",
			data: {
				units: "ca"
			},
			success: function( response ) {
				console.log("In function response");
				$("#forecastlink").attr("href", function() {
					var url = "/forecast?lat=" + latitude + "&lng=" + longitude + "&loc=" + geocodeResult.formatted_address;
					return url;
				});

				$('#summary').text(response.currently.summary);
				$('#sunrise').text(convertTimezone(response.daily.data[0].sunriseTime * 1000));
				$('#sunset').text(convertTimezone(response.daily.data[0].sunsetTime * 1000));
				$('#weather-img').attr("src", "/images/icons/" + response.currently.icon + ".png");
				$('#windspeed').text(response.currently.windSpeed + " km/h");
				$('#cloudcover').text(Math.round(response.currently.cloudCover * 10000)/100 + "%");
				$('#humidity').text(Math.round(response.currently.humidity * 10000)/100 + "%");
				$('#rainchance').text(Math.round(response.currently.precipProbability * 10000)/100 + "%");
				$('#apptemperature').text(response.currently.apparentTemperature + " °C");
				$('#temperature').text(response.currently.temperature + " °C");
				$('#hour').text(response.hourly.data[0].summary);
				$('#tfhour').text(response.hourly.summary);
				$('#week').text(response.daily.summary);
				$('#maxtemperature').text(response.daily.data[0].temperatureMax + " °C");
				$('#mintemperature').text(response.daily.data[0].temperatureMin + " °C");
				$('#location').text(geocodeResult.formatted_address);
				
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

				$("#bgimage").attr("src", "/images/weather/" + response.currently.icon + ".jpg");
				clock();
				console.log( response.currently );
				console.log( response ); // server response
			},
			complete: function() {
				$("#spinner").fadeOut("slow", function() {
					$(".card").fadeIn("slow");		
				});
			}
		});
		landing();
	}

	function showForecastCallback(geocodeResult, parsedGeocodeResult, lat, lng, loc){
		lat = typeof lat !== 'undefined' ? lat : null;
  		lng = typeof lng !== 'undefined' ? lng : null;
  		loc = typeof loc !== 'undefined' ? loc : null;
  		function landing() {
			if ($("#main").css("display") == "none") {
				$("#landing").slideUp("slow", function() {
					$("#searchdiv").removeClass("col-sm-offset-3", "slow", function() {
						$("#main").fadeIn("slow");	
					});
				});
				$(".info").slideUp("slow");
			}
		}

		if ($(".fahrenheit").hasClass("badge")) {
			$(".fahrenheit").toggleClass("badge");
			$(".celcius").toggleClass("badge");
		}

		$(".fcard").fadeOut("slow", function() {
			$("#spinner").fadeIn("slow");
		});

		function setday(i) {
			var weekday = new Array(7);
			weekday[0]=  "Sunday";
			weekday[1] = "Monday";
			weekday[2] = "Tuesday";
			weekday[3] = "Wednesday";
			weekday[4] = "Thursday";
			weekday[5] = "Friday";
			weekday[6] = "Saturday";
			var today = (new Date()).getDay();
			switch(i) {
				case 0: return "Today";
				case 1: return "Tomorrow";
				default: return weekday[(today+i)%7];
			}
		}

		console.log("In showCallback");
		console.log(geocodeResult);
		console.log(parsedGeocodeResult);
		var latitude = ((parsedGeocodeResult == null)? lat: parsedGeocodeResult.lat);
	  	var longitude = ((parsedGeocodeResult == null)? lng: parsedGeocodeResult.lng);
	  	$.ajax({
			url: "https://api.forecast.io/forecast/" + key + "/" + latitude + "," + longitude,
			jsonp: "callback",
			dataType: "jsonp",
			data: {
				units: "ca"
			},
			success: function( response ) {

				function convertTimezone(d) {
					var current = new Date(d);
					var currenttime = current.getTime();
					var offset = current.getTimezoneOffset() * 60000;
					var utctime = currenttime + offset;
					var locationTime = utctime + (3600000 * response.offset);
					var location = new Date(locationTime);
					return location.toLocaleTimeString();
				}
				for (var i = 0; i < 8; i++) {
					$('#summary'+i).text(response.daily.data[i].summary);
					$('#sunrise'+i).text(convertTimezone(response.daily.data[i].sunriseTime * 1000));
					$('#sunset'+i).text(convertTimezone(response.daily.data[i].sunsetTime * 1000));
					$('#weather-img'+i).attr("src", "/images/icons/" + response.daily.data[i].icon + ".png");
					$('#humidity'+i).text(Math.round(response.daily.data[i].humidity * 10000)/100 + "%");
					$('#rainchance'+i).text(Math.round(response.daily.data[i].precipProbability * 10000)/100 + "%");
					$('#maxtemperature'+i).text(response.daily.data[i].temperatureMax + " °C");
					$('#mintemperature'+i).text(response.daily.data[i].temperatureMin + " °C");
					$('#day'+i).text(setday(i));
				};
				if (parsedGeocodeResult != null)
					$('#location').text(geocodeResult.formatted_address);
				else
					$('#location').text(loc.replace(/%../g, " "));
				
				$("#bgimage").attr("src", "/images/weather/" + response.currently.icon + ".jpg");
				
				console.log( response.currently );
				console.log( response ); // server response
			},
			complete: function() {
				$("#spinner").fadeOut("slow", function() {
					$(".fcard").fadeIn("slow");
					$("#arrow").delay(5000).fadeOut(); 
				});
			}
		});
		landing();
	}
});