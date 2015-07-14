/**
* Ref.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      //"ref_id": {type: "string"},
      "v_id": {type: "string"},
      "f_satz": {type: "string"},
      "f_nr": {type: "integer"},
      "kursleiter": {model: "vorlesung"}

      /*
      fragen: {
            collection: 'frage',
            via: 'owner'
      },
      kommentare: {
            collection: 'komment',
            via: 'owner'
      },
      links: {
            collection: 'link',
            via: 'owner'
      },
      notizen: {
            collection: 'notiz',
            via: 'owner'
      },
      texte: {
            collection: 'text',
            via: 'owner'
      }
      */
  }
};

