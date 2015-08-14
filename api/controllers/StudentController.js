/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  'app.cachefile': function(req,res) {
    var fs = sails.fs;
    var path = 'app.cachefile';
    fs.stat(path, function(error, stats) {
        fs.open(path, "r", function(error, fd) {
            if(error) {
                return res.send({});
            }
            var buffer = new Buffer(stats.size);

            fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
                var data = buffer.toString("utf8", 0, buffer.length);
                fs.close(fd);
                res.header('Content-Type', 'text/cache-manifest');
                res.writeHead(200, {'Content-Type': 'text/cache-manifest'});
                return res.send(data);
            });
        });
    });
  },

  'app.cache': function(req,res) {
    var c = require('appcache-node');
    // generate a cache file
    var cf = c.newCache([
      /*
      '../vendor/bootstrap-multiselect/bootstrap-multiselect.css',
      '../styles/bootstrap.css',
      '../styles/importer.css',
      '../styles/reveal-importer.css',
      '../styles/reveal/theme/serif.css',

      '../vendor/jquery/jquery.js',
      '../vendor/jquery.validate/jquery.validate.js',
      '../vendor/handlebars/handlebars.js',
      '../vendor/bootstrap/bootstrap.js',
      '../vendor/bootstrap-multiselect/bootstrap-multiselect.js',
      '../vendor/sails.io.js/sails.io.js',
      '../vendor/jquery-indexeddb/jquery.indexeddb.js',
      '../js/dependencies/jquery/customValidate.js',
      '../js/dependencies/underscore.js',
      '../js/reveal/lib/js/classList.js',
      '../js/reveal/lib/js/head.min.js',
      '../js/reveal/lib/js/html5shiv.js',
      '../js/reveal/reveal.js',
      '../js/customView.js',
      '../js/positioning.js',
      '../js/notiz.js',
      '../js/app.js',
      */

      '../video/videoA.mp4',
      '../video/videoB.mp4',
      

      '\n',
      'NETWORK:\n',
      '*'
    ]);

    // in your request handler
    //if(r.url.match(/app\.cache$/)){
    res.writeHead(200, {'Content-Type': 'text/cache-manifest'});
    return res.end(cf);
    //}
  },

  findStudentsForLecture: function(req,res,next){

    var kursId = req.param('id');
    console.log('findStudentsForLecture: '+kursId);
    var allStudents = {inLecture: [], notinLecture: []};
    Vorlesung.findOne({id: kursId}).populateAll().exec(function found(err,vorlesung){
      if (err) {
        res.redirect('/vorlesung');
      }
      if (vorlesung.teilnehmer) {
        allStudents.inLecture = vorlesung.teilnehmer;
      }
      // {id: kursId} to populate param
      Student.find().populate('vorlesungen', {id: kursId}).exec(function found(err,studenten){

        for (var student in studenten) {
          var kurs = studenten[student].vorlesungen;
          if (kurs.length == 0) {
            allStudents.notinLecture.push(studenten[student]);
          }
        }

        return res.json(allStudents);
      });
    });
  },

  kurse: function(req,res,next){
    res.view();
  },

  findStudentByVorlesung: function(req,res,next){
    console.log('findStudentByVorlesung');
    Student.find({vorlesungen:'54f5cf74276c2a481a000001'}).exec(function studentFound(err,student){
      console.log('findStudentByVorlesung');
      console.log(student);
      console.log();
    });
  },
  getModel: function(req,res, next){
    //var type = 'student'
    var result = {
      type: 'student',
      data: {}
    };
    var attrObj = Student.attributes;

    for(var k in attrObj) {
      if (!(k=='id' || k=='encryptedPassword' || k=='slug' || k=='vorlesungen' || k=='user'|| k=='createdAt'|| k=='updatedAt')
        && typeof attrObj[k] === 'object' ) {
        result.data[k] = attrObj[k];
      }
    }
    result.data['password'] = {type: 'string'};
    result.data['confirmation'] = {type: 'string'};

    //delete result.data.createdAt;
    //delete result.data.updatedAt;

    return res.json(result);
  },

	index: function(req,res, next){
    if(req.param('list') == undefined) {
      return res.redirect('/vorlesung');
    } else if(req.session.User.isadmin) {
      Student.find().populateAll().exec(function foundKurs(err,studenten){
        if(err) {
          return res.send(err,500);
        }
        return res.view({
          studenten: studenten
        });
      });
    } else {
      return res.redirect('/vorlesung');
    }
  },



  kursliste: function(req,res, next){

    var studId = req.session.User.student;

    if(req.session.authenticated) {
      Student.findOne({id: studId}).populate('vorlesungen').exec(function(err, student){
        if(err || student == undefined){
          console.log("Student: "+studId+" nicht gefunden");
          return res.redirect("/");
        }
        res.view({
          kurse: student.vorlesungen,
          studentId: studId
        });
      });
    } else {
      res.redirect("/");
    }
  },

  new: function(req,res, next) {
    console.log('handler: new');
    res.view();
  },

  create: function(req,res, next) {

    if(req.param('isadmin') == 'on') {
      req.params.isadmin = true;
    } else {
      req.params.isadmin = false;
    }

    var studentObj = {
      name: req.param('name'),
      vorname: req.param('vorname'),

		  email: req.param('email'),
	    matrikel: req.param('matrikel'),

	    password: req.param('password'),
	    confirmation: req.param('confirmation')
    };

    var userObj = {
      email: req.param('email'),
      isprof: 'false',
      isadmin: req.param('isadmin'),

      password: req.param('password'),
      confirmation: req.param('confirmation')
    };



    User.create(userObj, function userCreated(err, user){
      if (err) {
        console.log('user create error: '+JSON.stringify(err));
        req.session.flash = { err: err };
        return res.redirect('/student/new');
      }

      studentObj.user = user.id;
      Student.create(studentObj, function studentCreated(err, student){
        if (err) {
          console.log('student create error: '+JSON.stringify(err));
          req.session.flash = { err: err };
          User.destroy({id: user.id}, function userDestroyed(err){
            if(err) {
              console.log('user destroy error: '+JSON.stringify(err));
              req.session.flash = { err: err };
            }
          });
          return res.redirect('/student/new');
        }
        User.update({id: user.id}, {student: student.id}, function userUpdated(err, updated){
          if (err) {
            console.log('user update error: '+JSON.stringify(err));
            req.session.flash = { err: err };
          }
        });

        res.redirect('/student/show/'+student.id);

      });
    });

  },

  show: function(req,res, next) {
    Student.findOne(req.param('id')).populate('user').exec(function foundUser(err, student) {
        if(err) return next(err);
        if(!student) {
            return next();
        }
        res.view({
            student: student
        });
    });
  },

  edit: function(req,res, next) {
    Student.findOne(req.param('id')).populate('vorlesung').exec(function foundUser(err, student){
        if(err) return next(err);
        if(!student) return next();
        res.view({
            student: student,
            kurse: student.vorlesung
        });
    });
},

};

