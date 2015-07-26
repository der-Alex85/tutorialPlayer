$(document).ready(function() {


	window.onbeforeunload = function(e) {


		storePosition();


    return '.';
	};


});


function storePosition() {
	Object.keys(localStorage).forEach(function(key){
		var splittedKey = key.split('-');
		if(splittedKey[0] == 'k' && splittedKey[1] == 'pos'){
			var user = $('.view-container').attr('user');
			var kurs = splittedKey[2];
			var satz = JSON.parse(localStorage.getItem(key));


			var foliePos = JSON.parse(localStorage.getItem('s-pos'+satz.satz));


			var pos = {};
			pos.user = user;
			pos.kurs = kurs;
			pos.satz = satz;
			pos.indexh = foliePos.indexh;
			pos.indexv = foliePos.indexv;
			pos.file = foliePos.file;

			$.post('/pos/updatePos', pos, function(p){
				console.log("position ");
			});
		}
	});
}