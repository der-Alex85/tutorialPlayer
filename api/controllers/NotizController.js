/**
 * NotizController
 *
 * @description :: Server-side logic for managing notizs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getNotesByVorlSatz: function(req,res,next) {
    var params = req.allParams();
    Notiz.find(params).exec(function found(err, notizen){
      if (err){ next(); }
      return res.json(notizen);
    });
  },

  createNoteForVorlSatzFolie: function(req,res,next) {
    var params = req.allParams();
    Notiz.create(params, function created(err, notiz){
      if(err) { res.json({}); }
      return res.json(notizen);
    });
  }
};

