module.exports = {
	
	index: function(req,res,next){
		return res.view();
	},

	warn: function(req,res,next){
		console.log('warn:')
		console.log(req.session.flash);
		return res.view({
			warning: 'Login fehlgeschlagen! Benutzername oder Passwort ungültig.'
		});
	}	
};

