$(document).ready(function() {


	window.onbeforeunload = function(e) {


		storePosition();


    return '.';
	};


});


function storePosition() {
	Object.keys(localStorage).forEach(function(key){
		var splittedKey = key.split('-');
		if(splittedKey[0] == 'pos'){
			var user = $('.view-container').attr('user');
			var kurs = splittedKey[1];
			var localPos = JSON.parse(localStorage.getItem(key));

			var pos = {};
			pos.user = user;
			pos.kurs = kurs;
			pos.satz = localPos.satz;
			pos.folie = localPos.folie;
			pos.file = localPos.file;

			$.post('/pos/updatePos', pos, function(p){
				console.log("position ");
			});
		}
	});
}