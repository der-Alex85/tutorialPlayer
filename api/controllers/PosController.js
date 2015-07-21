module.exports = {

	getPosByUserAndLecture: function(req,res,next) {
		var u = req.param('user');
		var k = req.param('kurs');
		Pos.findOne({user: u, kurs: k}).exec(function(err,pos){
			if(err) {
				var posObj = {
					user: u, kurs: k,
					satz: '', folie: '1'
				}
				Pos.create(posObj, function posCreated(err, pos){
					if (err) {
						return res.json({});
					};
					return res.json(posObj);
				});
			}
			return res.json(pos);
		});
	},

	getPosByUser: function(req,res,next) {
		var userId = req.param('id');
    if(userId == undefined) {
      userId = req.session.User.id;
    }

    Pos.find({user: userId}).exec(function(err, pos){
    	if(err) { console.log("err: "+err);}
    	console.log(JSON.stringify(pos));
    	return res.json(pos);
    });
	},

	updatePos: function(req,res,next){
		var user = req.param('user');
		var kurs = req.param('kurs');
		var satz = req.param('satz');
		var folie = req.param('folie');
		var file = req.param('file');
		Pos.update({user: user, kurs: kurs}, {satz: satz, folie: folie, file: file}, function posUpdated(err, pos){
			if(err || pos.length == 0) {
				var posObj = {
					user: user, kurs: kurs, satz: satz, 
					folie: folie, file: file
				}
				Pos.create(posObj, function posCreated(err, pos){
					if(err) {
						console.log(JSON.stringify(err));
					} 
				});
			}
			
        //if(err) return res.redirect('/user/edit/'+req.param('id'));
        //res.redirect('/user/show/'+req.param('id'));
    });
	}
}
