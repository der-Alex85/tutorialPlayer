/*
module.exports = function(req, res, ok) {

	if (req.session.authenticated) {
   		return ok();
 	} else {
 		var requireLoginError = [{name: 'requireLogin', message: 'You must be signed in.'}];
 		req.session.flash = {
 			err: requireLoginError
 		}

 		res.redirect('/session/new');
 		return;
 	}

}
*/

/**
 * Allow any authenticated user.
 */
module.exports = function(req, res, ok) {
  console.log(">>>>>>>> POLICY: authenticated");
  // User is allowed, proceed to controller

  //console.log("clone session: "+JSON.stringyfy(req.session));

  res.locals.position = _.clone(req.session.position);

  req.session.position = {
    kurs: '',
    satz: '',
    folie: ''
  };

  if (req.session.User) {
    console.log("auth sucess");
    return ok();
  }

  // User is not allowed
  else {
    // 	var requireLoginError = [{name: 'requireLogin', message: 'You must be signed in.'}]
    // req.session.flash = {
    // 	err: requireLoginError
    // }
    // res.redirect('/session/new');
    //   return;
    console.log("auth failed");
    res.send(403);
  }
};