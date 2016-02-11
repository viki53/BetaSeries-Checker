/**
 * BetaSeries Checker
 *
 * The Pebble app to help you check your BetaSeries episodes
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var api_root = 'https://api.betaseries.com/';
var api_version = '2.4';
var api_key = 'c36b8c62540f';
var api_headers = {
	'Accept': 'application/json',
	'X-BetaSeries-Version': api_version,
	'X-BetaSeries-Key': api_key
};

var user_api_token = localStorage.getItem('user_api_token');

Pebble.addEventListener('showConfiguration', function(e) {
	ajax({
		url: api_root + 'members/oauth',
		method: 'POST',
		type: 'json',
		headers: api_headers
	},
	function(data) {
		console.log('Success: ' + JSON.stringify(data));
		if (data && data.oauth && data.oauth.key) {
			// Show config page
			Pebble.openURL('https://www.betaseries.com/oauth?key=' + data.oauth.key);
			
			Pebble.addEventListener('webviewclosed', function(e) {
				console.log('Returned: ' + e.response);

				// Send settings to Pebble watchapp
				Pebble.sendAppMessage({'user_api_token': e.response.token}, function(){
					console.log('Sent config data to Pebble');
				}, function() {
					console.log('Failed to send config data!');
				});
			});
		}
		// user_api_token = ;
	},
	function(error) {
		console.log('Download failed: ' + JSON.stringify(error));
	});
});

Pebble.addEventListener('appmessage', function(e) {
	console.log('Received message: ' + JSON.stringify(e.payload));
});

function gotUserToken (token) {
	user_api_token = token;
	api_headers['X-BetaSeries-Token'] = user_api_token;
	localStorage.setItem('user_api_token', user_api_token);
}
if (user_api_token) {
	gotUserToken(user_api_token);
}

var main = new UI.Card({
  title: 'BetaSeries',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello World!',
  body: 'Press any button.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

Pebble.addEventListener('ready', function(e) {
    console.log('Hello world! - Sent from your javascript application.');
});
