function insertReply(content) {
	var temp = document.getElementById('temperature');
	temp.innerHTML = content.main.temp;
}

function getWeather() {
	var location = document.getElementById('search').value;
	var jsonURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + location + '&APPID=' + apikey + '&units=metric&callback=insertReply';
	var script = document.createElement('script');
	script.src = jsonURL;
	document.body.appendChild(script);
	script.parentNode.removeChild(script);
}