/**
 * NotizController
 *
 * @description :: Server-side logic for managing notizs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  // getNotesByUser: function(req,res,next) {
  //   var user = req.param('user');

  //   Pos.find({user: user}).exec(function posFound(err,pos){
  //     if(err) {
  //       next();
  //     }
  //     console.log(JSON.stringify(pos));
  //     // TODO: return zu früh!!!
  //     var res = [];
  //     for (var p in pos){
  //       Notiz.find().populate('pos', {user: pos[p].user}).exec(function noteFound(err, notizen){
  //         res.push(notizen)
  //         return res.json(notizen);
  //       });
  //     }



  //   });
  // },
  getNotesByUser: function(req,res,next) {
    var userId = req.param('id');
    Notiz.find().populate('pos', {user: userId}).exec(function noteFound(err, notizen){
      if(err) {next();}
      return res.json(notizen);
    });
  },


	getNotesByPos: function(req,res,next) {

    var params = {};
    params.user = req.param('user');
    params.kurs = req.param('kurs');
    params.satz = req.param('satz');
    params.idnexh = req.param('indexh');
    params.idnexv = req.param('indexv');

    Pos.find(params).populate('notizen').exec(function posFound(err, pos){
      if (err){ 
        console.log(JSON.stringify(err));  
        next(); 
      }
      return res.json(pos.notizen);
    });
  },

  createNoteByPos: function(req,res,next) {    
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
        Pos.create(posObj, function posCreated(err, pos){
          if(err) {
            console.log(JSON.stringify(err));
          }     
          Notiz.create({text: text, pos: pos.id}, function notizCreated(err, notiz){
            if(err){
              return next();
            }
            Notiz.findOne({id: notiz.id}).populate('pos').exec(function notizFound(err, notiz){
              return res.json(notiz);  
            });
          });
        });
      } else {
         Notiz.create({text: text, pos: pos.id}, function notizCreated(err, notiz){
          if(err){
            return next();
          }
          Notiz.findOne({id: notiz.id}).populate('pos').exec(function notizFound(err, notiz){
              return res.json(notiz);  
          });
        });
      }
    
    });
  }
}

