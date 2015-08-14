/**
 * FrageController
 *
 * @description :: Server-side logic for managing frages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  getFragenAll: function(req,res,next) {
    Frage.find().populate('pos').exec(function frageFound(err, fragen){
      if(err) {next();}
      return res.json(fragen);
    });
  },

	getFrageByUser: function(req,res,next) {
    var userId = req.param('id');
    Frage.find().populate('pos', {user: userId}).exec(function frageFound(err, fragen){
      if(err) {next();}
      return res.json(fragen);
    });
  },


	getFrageByKurs: function(req,res,next) {
    var kursId = req.param('id');
    Frage.find().populate('pos', {kurs: kursId}).exec(function frageFound(err, fragen){
      if(err) {next();}
      return res.json(fragen);
    });

    // Pos.find(params).populate('fragen').exec(function posFound(err, pos){
    //   if (err){ 
    //     console.log(JSON.stringify(err));  
    //     next(); 
    //   }
    //   return res.json(pos.fragen);
    // });
  },

	createFrageByPos: function(req,res,next) {
		var user = req.param('user');
    var kurs = req.param('kurs');
    var satz = req.param('satz');
    var indexh = req.param('indexh');
    var indexv = req.param('indexv');
    var file = req.param('file');
    var text = req.param('text');

    Pos.findOne({user: user, kurs: kurs, satz: satz, indexh: indexh, indexv: indexv}).exec(function posFound(err, pos){
      if(err){
        return next();
      }

      if (pos == undefined) {
        var posObj = {
          user: user, kurs: kurs, satz: satz, 
          indexh: indexh, indexv: indexv, file: file
        }

console.log('posobj'+JSON.stringify(posObj));

        Pos.create(posObj, function posCreated(err, pos){
          if(err) {
            console.log(JSON.stringify(err));
          }

          Frage.create({text: text, pos: pos.id}, function frageCreated(err, frage){
            if(err){
              return next();
            }
            Frage.findOne({id: frage.id}).populate('pos').exec(function frageFound(err, frage){
              return res.json(frage);  
            });
          });
        });
      } else {
         Frage.create({text: text, pos: pos.id}, function frageCreated(err, frage){
          if(err){
            return next();
          }
          Frage.findOne({id: frage.id}).populate('pos').exec(function frageFound(err, frage){
              return res.json(frage);  
          });
        });
      }
    
    });
	}
};
