/**
* Notiz.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    "kurs": {type: "string", required: "true"},
    "satz": {type: "string", required: "true"},
    "folie": {type: "string", required: "true"},
    "index": {type: "integer", required: "true"},

    "text": {type: "string", required: "true"}

    //"owner": {model: "ref"}
  }
};

