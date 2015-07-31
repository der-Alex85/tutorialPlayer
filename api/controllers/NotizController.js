/**
 * NotizController
 *
 * @description :: Server-side logic for managing notizs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getNotesByPos: function(req,res,next) {

    var params = {};
    params.user = req.param('user');
    params.kurs = req.param('user');
    params.satz = req.param('user');
    params.idnexh = req.param('indexh');
    params.idnexv = req.param('indexv');

    Pos.find(params).populate('notiz').exec(function posFound(err, pos){
      if (err){ next(); }
      return res.json(pos.notizen);
    });
  },

  createNoteByPos: function(req,res,next) {    
    var user = req.param('user');
    var kurs = req.param('kurs');
    var satz = req.param('satz');
    var indexh = req.param('indexh');
    var indexv = req.param('indexv');
    var text = req.param('text');

    Pos.findOne({user: user, kurs: kurs, satz: satz, indexh: indexh, indexv: indexv}).populate('notiz').exec(function posFound(err, pos){
      if(err){
        next();
      }
      Notiz.create({text: text, pos: pos}, function notizCreated(err, notiz){
        if(err){
          next();
        }
        return res.json(notiz);
      });
    });
  }
};

