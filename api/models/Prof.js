/**
* Prof.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {
  schema: true,

attributes: {
      titel:    { type: 'string' },
      name:     { type: 'string', required: true },
      vorname:  {type: 'string', required: true },
      slug:     { type: 'string' },
      email:    { type: 'email', unique: true, required: true },
      //isadmin:    { type: 'boolean', defaultsTo: false },
      //isonline:   { type: 'boolean', defaultsTo: false }, // delete ???
      encryptedPassword: { type: 'string' },
      
      
      vorlesungen: {   
        collection: 'Vorlesung',
        via: 'kursleiter'
      },
    

      user: {
        model: 'User'
      },

      

      toJSON: function(){
        var obj = this.toObject();
        //delete obj.password;
        delete obj.slug;
        delete obj.confirmation;
        delete obj.encryptedPassword;
        delete obj._csrf;

//        delete obj.user;

        return obj;
     }, 

     toMinJSON: function(){
        var obj = this.toObject();
        //delete obj.password;
        delete obj.slug;
        delete obj.confirmation;
        delete obj.encryptedPassword;
        delete obj._csrf;
        delete obj.createdAt;
        delete obj.updatedAt;
//        delete obj.id;

        return obj;
     }

  },


  beforeValidation: function(values, next) {
    next();
  },

  beforeUpdate: function(values, next) {
    console.log('beforeUpdate');
    next();
  },

  //life-cycle of create
  
  beforeCreate: function(values, next) {
    if (!values.password || values.password != values.confirmation) {
      return next({err: "Password does not match pasword confirmation!"});
    }

    //slugs
    if(!values.name) {
      return next({err: ["Must have a username!"]});
    }
    values.slug = values.name.replace(/\s+/g, '').toLowerCase();

    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword){
      if(err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });
  }
   
};