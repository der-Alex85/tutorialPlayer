/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


var UserController = {


kursliste: function(req,res,next){
    console.log('test authenticated: '+req.session.authenticated);
    console.log("session.position in getkursdata: "+req.session.position);
    Vorlesungen.find({}, function(err,kurse){
        res.view({
            kurse: kurse
        });
    });

},

getUserData: function(req,res,next){
    User.findOne(req.param('id')).populate('prof').populate('student').exec(function foundProf(err, user) {
        if(err)   return next(err);
        if(!user) return next();
        return res.json(user.toMinJSON());
    });

  },

index: function(req,res, next){
    User.find().populate('prof').populate('student').exec(function(err,users){
        if(err) return res.send(err,500);
        res.view({
            users: users
        });
    });
},

new: function(req,res) {

    res.view({
        prof: req.param('prof')
    });


},

create: function(req,res, next) {
    var userObj = {
            name: req.param('name'),
            vorname: req.param('vorname'),
            titel: req.param('titel'),
            email: req.param('email'),

            password: req.param('password'),
            confirmation: req.param('confirmation')
    };



    User.create(userObj, function userCreated(err, user){
        if (err) {
            req.session.flash = {
                err: err
            }

            return res.redirect('/');
        }

        req.session.authenticated = true;
        req.session.User = user;

        //change status to online
        user.isonline = true;
        user.save(function(err,user){
            if(err) return next(err);
            // add the action attribute to the user object for the flash message.
            user.action = " signed-up and logged-in.";
            // let other subscribed sockets know that the user was created
            User.publishCreate(user);
            // after success defined, redirect to show action
            res.redirect('/user/show/'+user.id);
        });



   });
},


show: function(req,res, next) {


    User.findOne(req.session.User.id, function foundUser(err, user) {
        if(err) return next(err);
        if(!user) {
            return next();
        }
        res.view({
            user: user      //searches for views/user/show.ejs
        });
    });
},
edit: function(req,res, next) {
    User.findOne(req.param('id'), function foundUser(err, user){
        if(err) return next(err);
        if(!user) return next();
        res.view({
            user: user
        });
    });
},
update: function(req,res, next) {
/*
    if(req.param.admin == "unchecked") {
        console.log('kein admin');
        req.param.admin = false;
    } else if(req.param('admin')[1] == 'on') {
        console.log('admin');
        req.param.admin = true;
    }
    */


    if (req.session.User.isadmin) {
        var userObj = {
            name: req.param('name'),
            title: req.param('title'),
            email: req.param('email'),
            isadmin: req.param('isadmin')
        };
    } else {
        var userObj = {
            name: req.param('name'),
            title: req.param('title'),
            email: req.param('email')
        };
    }
    User.update(req.param('id'), userObj, function userUpdate(err){

        //if(err) return res.redirect('/user/edit/'+req.param('id'));
        //res.redirect('/user/show/'+req.param('id'));
    });
},
destroy: function(req,res, next) {
    User.findOne(req.param('id'), function foundUser(err,user){
        if(err) return next(err);
        if(!user) return next('User not exist.');

        var saved_user_name = user.name;
        User.destroy(req.param('id'), function userDestroyed(err){
            if(err) return next(err);

            // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
            User.publishUpdate(user.id, {
                name: user.email,
                action: ' has been destroyed.'
            });

            // let other sockets know that the user instance was destroyed
            User.publishDestroy(user.id);
        });
        res.redirect('/user');
    });
},

subscribe: function(req, res, next) {
    User.find(function foundUsers(err,users){
        if(err) return next(err);
        User.watch(req.socket);
        User.subscribe(req.socket, users);
        
        res.send(200);
    });
},

profile: function(req,res,next){
    var slug = req.param('slug');
    if(slug.match(/\..+$/)) return next();

    User.findOneBySlug(slug).exec(function(err,user){
        if (err) return res.serverError(err);
        if (!user) return next();
        res.view({user:user});
    });
}



};

module.exports = UserController;

