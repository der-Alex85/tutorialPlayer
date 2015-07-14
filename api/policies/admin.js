module.exports = function(req,res,ok){
	console.log(">>>>>>> POLICY: admin");
	if(req.session.User && req.session.User.isadmin) {
		return ok();
	} else {
		var requiredAdminError = [{name: 'requiredAdminError', message: 'You must be an admin.'}];
		req.session.flash = {
			err: requiredAdminError
		}
		res.redirect('/session/new');
		return;
	}
}