$(document).ready(function() {

	// Login page
	if(window.location.pathname.toString() == '/') {

		window.localStorage.removeItem('student-Id');

		$('.form-signin').submit(function(e) {
    	e.preventDefault();
    	
    	var mailInput = $(this).find('input[name="email"]').val();
			var pwdInput = $(this).find('input[name="password"]').val();
			var entryInIndex = false;
			var entry = {};

			$.indexedDB("TutorialPlayer").objectStore("Student").index('mailIndex').each(function(elem){
				if(elem.key == mailInput) {
					entryInIndex = true;
					entry = elem.value;
				}
			});

			if(entryInIndex == false) {
				this.submit();
			} else if(entry.user.email == mailInput) { // && entry.user.encryptedPassword == pwdInput){

				window.localStorage.setItem('student-Id',entry.id);
				window.location.pathname = 'student/kursliste';	

			}
		});
	}

	if(window.location.pathname.toString().startsWith('/student/kursliste')) {

		var studId = '';
		if (window.localStorage.getItem('student-Id') != null) {
			studId = window.localStorage.getItem('student-Id');
		} else if($('.view-container').attr('student') != undefined) {
			studId = $('.view-container').attr('student');
		}

		// fetch student data
		$.post('/session/fetchAllData',{studId: studId},function(student){
			// update student in IndeedDB
			$.indexedDB("TutorialPlayer").objectStore("Student").add(student).done(function(){
    		console.log('Student data added!');
			});
		});

		
	}	

});