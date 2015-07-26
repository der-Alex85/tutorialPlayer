/**
 * VorlesungController
 *
 * @description :: Server-side logic for managing vorlesungs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  addStudent: function(req,res,next){
    console.log('add: ');
    var kurs = req.param('data').kurs;
    var student = req.param('data').student;

    Vorlesung.findOne({id: kurs}).populate('teilnehmer').exec(function found(err,kurs){
      kurs.teilnehmer.add(student);

      kurs.save(function(err){
        req.session.flash = { err: err };
        return res.redirect('/vorlesung');
      });

    });
    /*
    Vorlesung.update({},{}).exec(function updated(err,kurse){

    });
*/
    //return res.redirect('/vorlesung');

  },

  removeStudent: function(req,res,next){
    console.log('remove');
    var kurs = req.param('data').kurs;
    var student = req.param('data').student;

    Vorlesung.findOne({id: kurs}).populate('teilnehmer').exec(function found(err,kurs){

      kurs.teilnehmer.remove(student);
      kurs.save(function(err){
        req.session.flash = { err: err };
        return res.redirect('/vorlesung');
      });

    });
  },

  index: function(req,res,next) {
    if(req.param('list') == undefined) {
      if(req.session.User.isprof){
        var profId = req.session.User.prof;
        Vorlesung.find().where({'kursleiter': profId}).populateAll().exec(function foundKurs(err, kurse){
          if(err) {
            return res.send(err,500);
          }

          Prof.findOne({id: profId}).exec(function foundProf(err, prof){
            if(err) {
              prof = {};
            }
            kurse.kursleiter = prof;

            res.view({
              kurse: kurse
            });
          });
        });
      } else {
        var studId = req.session.User.student;
        Student.findOne(studId).populate('vorlesung').exec(function(err, student){
          res.view({
            kurse: student.vorlesungen
          });
        });
      }
    } else if (req.session.User.isadmin) {
      Vorlesung.find().populateAll().exec(function foundKurs(err,kurse){
        if(err) {
          return res.send(err,500);
        }
        res.view({
          kurse: kurse
        });
      });
    } else {
      return res.redirect('/vorlesung');
    }
  },

	getKursData: function(req,res,next) {

    var kursId = req.param('id');
    /*
    if(kursId == undefined) {           // ueberarbeiten.. api/policies/authenticated
      kursId = res.locals.position.kurs // was sind locals???
      console.log("LOCALS: "+kursId);
      console.log("LOCALS: "+JSON.stringify(res.locals));
    }
    */
    //req.params.all()
    Vorlesung.findOne({id: kursId}).populateAll().exec(function foundKurs(err, kurs) {
        if(err)   return next(err);
        if(!kurs) return next();

        return res.json(kurs);
    });
  },

  getModel: function(req,res,next){
    var result = {
    	type: 'vorlesung',
    	data: {}
    };
    var attrObj = Vorlesung.attributes;

    for(var k in attrObj) {
      if (!(k=='id' || k=='createdAt'|| k=='updatedAt')
        && typeof attrObj[k] === 'object' ) {
        result.data[k] = attrObj[k]
      }
    }


		//delete result.data.id;
		//delete result.data.teilnehmer;
		//delete result.data.folien;
		//delete result.data.createdAt;
		//delete result.data.updatedAt;

    return res.json(result);
  },

  create: function(req,res,next){

    console.log('vorl create: '+req.params.all());
  	var kursObj = {
  		titel: req.param('titel'),
  		beschreibung: req.param('beschreibung'),
      kursleiter: req.param('kursleiter')
  	};

  	Vorlesung.create(kursObj, function userCreated(err, kurs){
      if (err) {
        req.session.flash = { err: err };
        console.log(err);
        return res.redirect('/vorlesung');
      }

      return res.redirect('/vorlesung');
  	});
  },
  destroy: function(req,res,next){
		Vorlesung.findOne(req.param('id'), function foundUser(err,user){
      if(err) return next(err);
      if(!user) return next('User not exist.');

      Vorlesung.destroy(req.param('id'), function userDestroyed(err){
        if(err) return next(err);

        // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
        // let other sockets know that the user instance was destroyed
      });
      res.redirect('/vorlesung');

    });
  }

}

