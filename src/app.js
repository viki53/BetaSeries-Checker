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
// var api_key = 'bd31490685d2435b57637bc8495f3410';
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
				console.log('Returned: ' + JSON.stringify(e.response));
				
				// user_api_token = ;
				// localStorage.setItem('user_api_token', user_api_token);

				// Send settings to Pebble watchapp
				Pebble.sendAppMessage(e.response, function(){
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

if (!user_api_token) {
	
}
else {
	api_headers['X-BetaSeries-Token'] = user_api_token;
	// 'episodes/list'
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

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});