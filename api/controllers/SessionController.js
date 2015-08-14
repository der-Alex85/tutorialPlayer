module.exports = {


  // unused: delete
  getAppcache: function(req, res){
    var fs = require(appcache);

    var path = "views/app.cache";
    fs.exists(path, function(exists) {
      if (exists) {
        fs.stat(path, function(error, stats) {
          fs.open(path, "r", function(error, fd) {
            var buffer = new Buffer(stats.size);

            fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
              var data = buffer.toString("utf8", 0, buffer.length);
              fs.close(fd);
              return res.send(data);
            });
          });
        });
      }
    });
  },


  //fetch everything for given student
  fetchAllData: function(req,res,next) {
  	var studId = req.param('studId');
  	var data = {};

  	Student.findOne(studId).populate('user').populate('vorlesungen').exec(function(err, student){
        if(err || student == undefined){
          console.log("Student: "+studId+" nicht gefunden");
          return next();
        }

        return res.json(student);

      });


  },


	new: function(req,res) {



		/*
		var oldDateObj = new Date();
		var newDateObj = new Date(oldDateObj.getTime() + 60000);
		req.session.cookie.expires = newDateObj;
		req.session.authenticated = true;
		console.log(req.session);
		*/
		res.view('/session/new');

	},
/*
	sessionstore: function(req,res,next){
		console.log('sessionstore:');

		//if (req.session.position === undefined) {
		//	console.log('define position variable');
		//	req.session.position = {};
		//}


		if (req.param('kurs') !== undefined) {
			console.log('define kurs variable');
			req.session.position.kurs =  req.param('kurs');
		}
		if (req.param('satz') !== undefined) {
			console.log('define satz variable');
			req.session.position.satz =  req.param('satz');
		}
		if (req.param('folie') !== undefined) {
			console.log('define folie variable');
			req.session.position.folie =  req.param('folie');
		}

		return res.json(req.session.position);
	},
	*/

	create: function(req,res,next) {
		console.log('create session: '+JSON.stringify(req.session));
		if(!req.param('email') || !req.param('password')) {
			var usernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message: 'You must enter both a username and password.'}];
			req.session.flash = {
				err: usernamePasswordRequiredError
			}
			//return res.redirect('/root/warn');
			return;
		}

		User.findOneByEmail(req.param('email'), function foundUser(err, user){
			if (err) return next(err);
			if (!user) {
				var noAccountError = [{name: 'noAccount', message: 'The email address '+req.param('email')+' not found'}]
				req.session.flash = {
					err: noAccountError
				}
				return;
			}

			require('bcrypt').compare(req.param('password'), user.encryptedPassword, function(err, valid){
				if (err) return next(err);
				if (!valid) {
					var usernamePasswordMissmatchError = [{name: 'usernamePasswordMissmatch', message: 'Invalid username and password combination.'}];
					req.session.flash = {
						err: usernamePasswordMissmatchError
					}

					return;
				}

				req.session.authenticated = true;
				req.session.User = user;

				req.session.position = [];

        user.isonline = true;

        user.save(function(err,user) {
     			if(err) return next(err);


				  User.publishUpdate(user.id, {
        		loggedIn: true,
        		id: user.id,
        		name: user.email,
        		action: ' has logged in.'
          });


          if(req.session.User.isprof) {
            res.redirect('/vorlesung');
            //res.redirect('/prof/'+user.prof.id);
          } else {
            // overwrite blueprint in config/routes.js: 'get student/:id' 'StudentController.kursliste'
            res.redirect('/student/kursliste');
            //res.redirect('/student/kursliste/'+user.student.id);
          }
            //res.redirect('/user/show/'+user.id);
        });
			});
		});
	},

	destroy: function(req,res,next){
		User.findOne(req.session.User.id, function foundUser(err, user){

			if (user) {
			  var userId = req.session.User.id;
			  User.update(userId, {isonline: false}, function(err){
				if(err) return next(err);
				// Inform other sockets that this user is now logged out
        		User.publishUpdate(user.id, {
        			loggedIn: false,
        			id: user.id,
        			name: user.email,
        			action: ' has logged out.'
        		});
				req.session.destroy();
				res.redirect('/');
			  });
			} else {
			  req.session.destroy();
		 	  res.redirect('/');
			}
		});
	}
};
