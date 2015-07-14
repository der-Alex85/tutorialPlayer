/**
* Vorlesung.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      titel: {
        type: 'string',
        required: true
      },
      beschreibung: {
        type: 'string'
      },
      kursleiter: {
        model: 'Prof',
        required: true
      },
      teilnehmer: {
        collection: 'Student',
        via: 'vorlesungen'
      },
      folien: {
        collection: 'Foliensatz',
        via: 'vorlesung'
      }
      /*
      ,referenzen: {   
        collection: 'Ref',
        via: 'owner'
      }
      */
  }
};

