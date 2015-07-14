/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  // hidding password
  schema: true,

  attributes: {
      email:      { type: 'email', unique: true, required: true },
      slug:       { type: 'string' },
      isonline:   { type: 'boolean', defaultsTo: false },
      isadmin:    { type: 'boolean', defaultsTo: false },
      isprof:     { type: 'boolean', defaultsTo: false },
      encryptedPassword: { type: 'string' },


      student: {
        model: 'Student'
      },
      prof: {
        model: 'Prof'
      },

      /*
      name:     { type: 'string', required: true },
      vorname:  {type: 'string', required: true },
      slug:     { type: 'string' },
      title:    { type: 'string' },
      email:    { type: 'email', unique: true, required: true },
      admin:    { type: 'boolean', defaultsTo: false },
      prof:     { type: 'boolean', defaultsTo: false },
      online:   { type: 'boolean', defaultsTo: false },
      encryptedPassword: { type: 'string' },
      */

      toJSON: function(){
        var obj = this.toObject();
        
        //delete obj.password;
        //delete obj.confirmation;
        delete obj.encryptedPassword;
        //delete obj._csrf;
        
        return obj;
     },

     toMinJSON: function(){
        var obj = this.toObject();
        
        delete obj.encryptedPassword;
        delete obj.createdAt;
        delete obj.updatedAt;
        delete obj.id;

        if(obj.prof) {
          delete obj.prof.createdAt;
          delete obj.prof.updatedAt;
          delete obj.prof.user;
        }

        if(obj.student) {
          delete obj.student.createdAt;
          delete obj.student.updatedAt;
          delete obj.student.user;
        }

        return obj;
     }
  },

  beforeValidation: function(values, next) {
/*
    if (typeof values.profTmp !== "undefined") {
      if(values.profTmp == 'unchecked'){
        values.isprof = false;
      } else if(values.profTmp[1] == 'on'){
        values.isprof = true;
      }
    }
    
*/  
    next();
  },

  //life-cycle of create
  beforeCreate: function(values, next) {
    if (!values.password || values.password != values.confirmation) {
      return next({err: "Password does not match pasword confirmation!"});
    }
    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword){
      if(err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });

    //slugs moved to prof and user
    /*
    if(!values.name) {
      return next({err: ["Must have a username!"]});
    }
    values.slug = values.name.replace(/\s+/g, '').toLowerCase();
    */
  }
};

