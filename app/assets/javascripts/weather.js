function insertReply(content) {
	var temp = document.getElementById('temperature');
	temp.innerHTML = content.main.temp;
}

function getWeather() {
	var location = document.getElementById('search').value;
	var jsonURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + location + '&APPID=aaaac8df0843c32c3fdb3d915acec2a4&units=metric&callback=insertReply';
	var script = document.createElement('script');
	script.src = jsonURL;
	document.body.appendChild(script);
	script.parentNode.removeChild(script);
}