$(document).ready(function() {


	window.onbeforeunload = function(e) {


		storePosition();


    return '.';
	};


});


function storePosition() {
	var user = $('.view-container').attr('user');
	Object.keys(localStorage).forEach(function(key){
		var splittedKey = key.split('-');
		if(splittedKey.length > 2 && splittedKey[0] == 'k' && splittedKey[1] == 'pos'){
			var kurs = splittedKey[2];

			var satz = JSON.parse(window.localStorage.getItem(key)).satz;

			var s_pos = JSON.parse(window.localStorage.getItem('s-pos-'+satz));

			var pos = {};
			pos.user = user;
			pos.kurs = kurs;
			pos.satz = satz;
			pos.indexh = s_pos.indexh;
			pos.indexv = s_pos.indexv;
			pos.file = s_pos.file;

			$.post('/pos/updatePos', pos, function(p){
				console.log("position: "+JSON.stringify(p));
				return;
			});
		}
	});
}