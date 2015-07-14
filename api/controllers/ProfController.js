/**
 * ProfController
 *
 * @description :: Server-side logic for managing profs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  getModel: function(req,res, next){

    var result = {
      type: 'prof',
      data: {}
    };
    var attrObj = Prof.attributes;

    for(var k in attrObj) {
      if (!(k=='id' || k=='encryptedPassword' || k=='slug' || k=='vorlesungen' || k=='user'|| k=='createdAt'|| k=='updatedAt')
        && typeof attrObj[k] === 'object' ) {
        result.data[k] = attrObj[k]
      }
    }

    result.data['password'] = {type: 'string'};
    result.data['confirmation'] = {type: 'string'};

    //delete result.data.createdAt;
    //delete result.data.updatedAt;

    return res.json(result);
  },



  index: function(req,res,next) {
    if(req.param('list') == undefined) {
      return res.redirect('/vorlesung');
    } else if(req.session.User.isadmin) {
      Prof.find().populateAll().exec(function foundProf(err,profs){
        if(err) {
          return res.send(err,500);
        }
        res.view({
          profs: profs
        });
      });
    } else {
      return res.redirect('/vorlesung');
    }
  },


  getProfDataAll: function(req,res,next){
    Prof.find().populate('user').exec(function(err,profs){
        if(err) return res.send(err,500);
        return res.json(profs);
    });
  },



  new: function(req,res) {
    res.view();
    //res.redirect('/user/new');
  },

  update: function(req,res, next) {
    var obj = req.allParams();
    delete obj.id;

    Prof.update({id: req.param('id')}, obj, function profUpdated(err, updated){
      if (err) req.session.flash = { err: err };
      //return res.redirect('/prof/show/'+req.param('id'));
      return res.redirect('/prof');
    });
  },

  create: function(req,res, next) {

    if(req.param('isadmin') == 'on') {
      req.params.isadmin = true;
    } else {
      req.params.isadmin = false;
    }

    console.log("prof create:");

    var profObj = {
		  titel: req.param('titel'),
     	name: req.param('name'),
      vorname: req.param('vorname'),

	    email: req.param('email'),

	    password: req.param('password'),
	    confirmation: req.param('confirmation')
    };

    var userObj = {
      email: req.param('email'),
      isprof: 'true',
      isadmin: req.param('isadmin'),

      password: req.param('password'),
      confirmation: req.param('confirmation')
    };

    User.create(userObj, function userCreated(err, user){
      if (err) {
        console.log('user create error: '+JSON.stringify(err));
        req.session.flash = { err: err };
        return res.redirect('/prof/new');
      }

      profObj.user = user.id;
      Prof.create(profObj, function profCreated(err, prof){
        if (err) {
          console.log('prof create error: '+JSON.stringify(err));
          req.session.flash = { err: err };
          User.destroy({id: user.id}, function userDestroyed(err){
            if(err) {
              console.log('user destroy error: '+JSON.stringify(err));
              req.session.flash = { err: err };
            }
          });
          return res.redirect('/prof/new');
        }
        User.update({id: user.id}, {prof: prof.id}, function userUpdated(err, updated){
          if (err) {
            console.log('user update error: '+JSON.stringify(err));
            req.session.flash = { err: err };
          }
        });

        res.redirect('/prof/show/'+prof.id);

      });
    });

  },

  show: function(req,res, next) {
    Prof.findOne(req.param('id')).populate('user').exec(function foundProf(err, prof) {
        if(err)   return next(err);
        if(!prof) return next();
        res.view({
            prof: prof
        });
    });
  },

  edit: function(req,res, next) {
    Prof.findOne(req.param('id')).populate('user').exec(function foundProf(err, prof){
        if(err) return next(err);
        if(!prof) return next();
        res.view({
            prof: prof.toJSON()
        });
    });
  }
};

