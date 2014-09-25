function timezone(content) {
	console.log("in function");
	var time = document.getElementById('timezone');
	time.innerHTML = content.timeZoneName;
}

function insertReply(content) {
	var temp = document.getElementById('temperature');
	temp.innerHTML = content.main.temp;
	var coordinates = content.coord.lat + ',' + content.coord.lon;
	var timestamp = Math.round((new Date).getTime()/1000);
	console.log(coordinates);
	console.log(timestamp);
	var timezoneURL = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + coordinates + '&timestamp=' + timestamp + '&key=AIzaSyAaRcbc6uush5AHrMPz7nUQgC3L7NfKgEI&callback=timezone';
	console.log(timezoneURL);
	var script = document.createElement('script');
	script.src = timezoneURL;
	document.body.appendChild(script);
//	script.parentNode.removeChild(script);
}

function getWeather() {
	var location = document.getElementById('search').value;
	var jsonURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + location + '&APPID=' + apikey + '&units=metric&callback=insertReply';
	var script = document.createElement('script');
	script.src = jsonURL;
	document.body.appendChild(script);
	script.parentNode.removeChild(script);
}
