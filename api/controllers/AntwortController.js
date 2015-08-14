module.exports = {
	
	getAntwortByFrage: function(req,res,next){
		var frageId = req.param('frageId');
		Frage.findOne({id: frageId}).exec(function found(err,frage){
			Antwort.find().populate('frage', {frage: frageId}).exec(function found(err, antworten){
				if(err) {return next();}
				for(var a in antworten){
					antworten[a].frage = frage;
				}
				return res.json(antworten);
			});
		});
	},

	createAntwort: function(req,res,next){
		var frageId = req.param('frageId');
		var text = req.param('text');
		var user = req.param('user');

		Antwort.create({text: text, user: user, frage: frageId}, function created(err, antwort){
      if (err) {return next();}
      Antwort.findOne({id: antwort.id}).populate('frage').exec(function found(err, antw){
      	return res.json(antw);
    	});
		});
	}


};

