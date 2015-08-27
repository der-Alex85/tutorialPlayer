/**
 * FoliensatzController
 *
 * @description :: Server-side logic for managing Foliensatz
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


    subscribe: function(req, res, next) {
        Foliensatz.find(function foundUsers(err,satz){
            if(err) return next(err);
            Foliensatz.watch(req.socket);
            Foliensatz.subscribe(req, satz);
            
            res.send(200);
        });
    },

    destroy: function(req,res,next){
        var fs = require("fs");
        var path = "reveal-steps/"+req.param('kursId')+"/";
        var satzId = req.param('satzId');

        Foliensatz.destroy({id: satzId}).exec(function destroyedFoliensatz(err, satz){
            var file = satz[0].file;
            fs.rename(path+file, path+"deleted_"+file, function(err){});
        });
    },

    create: function(req,res,next){
        var fs = require("fs");
        var params = {};
        params.title = req.param('title');
        params.beschreibung = req.param('beschreibung');
        params.file = req.param('file');
        params.vorlesung = req.param('vorlesung');
        var kursPath = "reveal-steps/"+params.vorlesung;
        var fileName = params.title.toLowerCase().replace(/( |\/)/g,"_")+".html";
        params['file'] = fileName;

        fs.exists(kursPath, function(exists) {
            if (!exists) {
                fs.mkdir(kursPath, function(ok){});
            }
            if(fileName != undefined && fileName.length != 0) {
                fs.open(kursPath+'/'+fileName, 'ax', function(err, path) {
                    if(err) {
                        req.session.flash = { err: err };
                        return res.redirect('/vorlesung');
                    }
                    Foliensatz.create(params, function foliensatzCreated(err, satz){
                        if (err) {
                            req.session.flash = { err: err };
                        }


                        //try socket:
                        //Foliensatz.publishCreate(satz);
                        //Foliensatz.publishUpdate(satz.id, satz);


                    });
                    return res.redirect('/vorlesung');
                });
            }
        });

    },

    getModel: function(req,res,next){
        var result = {
            type: 'foliensatz',
            data: {},
            parent: ''
        };
        var attrObj = Foliensatz.attributes;

        for(var k in attrObj) {
          if (!(k=='id' || k=='createdAt'|| k=='updatedAt')
            && typeof attrObj[k] === 'object' ) {
            result.data[k] = attrObj[k]
          }
        }
        return res.json(result);
    },

    getStepList: function(req, res, next){
        var fs = sails.fs;
        var fileName = "steps/list.json";
        fs.exists(fileName, function(exists) {
            if (exists) {
                fs.stat(fileName, function(error, stats) {
                    fs.open(fileName, "r", function(error, fd) {
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

    // ToDo: pfad und namen parmetrisieren
    getRevealSlides: function(req, res, next){
        var fs = sails.fs;
        var kurs = req.param('kurs');
        var file = req.param('file');

        var path = "reveal-steps/"+kurs+"/"+file;
        /*
        fs.exists(path, function(exists) {
            console.log(1);
            if (exists) {
                console.log(2);
                */

                fs.stat(path, function(error, stats) {
                    fs.open(path, "r", function(error, fd) {
                        if(error) {
                            return res.send({});
                        }
                        var buffer = new Buffer(stats.size);

                        fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
                            var data = buffer.toString("utf8", 0, buffer.length);
                            fs.close(fd);
                            return res.send(data);
                        });
                    });
                });

                /*
            }
        });
*/
    }

};

