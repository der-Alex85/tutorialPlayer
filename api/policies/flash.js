module.exports = function(req, res, next) {
	console.log(">>>>>>>>> POLICY: flash");	
	res.locals.flash = {};

	if(!req.session.flash) return next();

	res.locals.flash = _.clone(req.session.flash);

	req.session.flash = {};
	
	if (!req.isSocket) {
		next();
	} 
	return;
}