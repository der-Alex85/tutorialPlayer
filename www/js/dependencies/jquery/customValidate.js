$(document).ready(function() {

	//http://jqueryvalidation.org

	
	$('#signin-up-form').validate({
		rules: {
			name: {
				required: true
			},
			email: {
				required: true, 
				email: true
			},
			password: {
				minlength: 1,
				required: true
			}/*,
			confirmation: {
				minlength: 1,
				equalTo: "#password"
			}*/
		},
		success: function(element) {
			element.text('OK!').addClass('valid');
		}
	});

});