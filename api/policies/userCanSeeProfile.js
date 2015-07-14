module.exports = function(req,res,ok){
	console.log(">>>>>>>> POLICY: usercanseeprofile");
	var sessionUserMatchesId = req.session.User.id === req.param('id');
	var isAdmin = req.session.User.isadmin;

	if(!(sessionUserMatchesId || isAdmin)){
		var noRightsError = [{name: 'noRightsError', message: 'You must be an admin.'}];
		req.session.flash = {
			err: noRightsError
		}
		res.redirect('/session/new');
		return;
	}
	ok();
};