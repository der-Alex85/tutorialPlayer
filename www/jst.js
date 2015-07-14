this["JST"] = this["JST"] || {};

this["JST"]["assets/templates/addUser.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<tr data-id="' +
__e( user.id ) +
'" data-model="user">\n\t';
 if(user.isonline) { ;
__p += '\n\t\t<td><img src="./images/icon-online.png"></td>\n\t';
 } else { ;
__p += '\n\t\t<td><img src="./images/icon-offline.png"></td>\n\t';
 } ;
__p += '\n\t<td>' +
__e( user.id ) +
'</td>\n\t<td>' +
__e( user.name ) +
'</td>\n\t<td>' +
__e( user.title ) +
'</td>\n\t<td>' +
__e( user.email ) +
'</td>\n\t\n\t';
 if(user.isadmin) { ;
__p += '\n\t\t<td> <img src="/images/admin.png"></td>\n\t';
 } else { ;
__p += '\n\t\t<td> <img src="/images/pawn.png"></td>\n\t';
 } ;
__p += '\n\n\t<td><a href="/user/show/' +
__e( user.id ) +
'" class="btn btn-small btn-primary">Show</a></td>\n\t<td><a href="/user/edit/' +
__e( user.id ) +
'" class="btn btn-small btn-warning">Edit</a></td>\n\t<td>\n\t\t<form action="/user/destroy/' +
((__t = ( user.id )) == null ? '' : __t) +
'" method="POST">\n\t\t\t<input type="hidden" name="_method" value="delete"/>\n\t\t\t<input type="submit" class="btn btn-sm btn-danger" value="delete"/>\n\t\t</form>\n\t</td>\n\n</tr>\n';

}
return __p
};

this["JST"]["assets/templates/folienTemplate.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n\n<div id="folien_slide" class="panel panel-primary">\n  <div class="panel-heading">\n    <h3 class="panel-title">Slides</h3>\n  </div>\n\n  <div class="panel-body">\n    <div id="reveal-parent"> <!--class="jumbotron"-->\n      <div class="reveal">\n        <div class="slides">\n\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div id="folien_notiz" class="panel panel-primary">\n  <div class="panel-heading">\n    <h3 class="panel-title">Notizen</h3>\n  </div>\n  <div class="panel-body">\n    <div id="note-container">\n      <div class="note">\n        <div class="date">Jun 11th, 2015</div>\n        Notiz!!!\n      </div>\n      <div class="note">\n        <div class="date">Jun 12th, 2015</div>\n        eine sehr lange Notiz. ljahdf kjadf akj kj jl dadsh hkv klag Notiz!!!.\n        aljfeh kslfd klafg khdf ajkhf bKHf ksbfklxz cvkhfbkzv kxvb x. sdfhodf fha khfbk fgsf.\n        snfba d fhjvb kvkbclkz fdkf cHDZcf dh CKC. dsfkjla khg fghfdhagf jkaeb dfcklcn szlkchsd hfgds cbks\n      </div>\n    </div>\n    <div class="meineNotiz">\n      <form action="" method="POST">\n        <textarea placeholder="Erstellen Sie hier eine private Notiz zur Folie" style="width: 100%;" rows="5" name="notizText"></textarea>\n        <input type="submit" value="Speichern" class="btn btn-success"/>\n      </form>\n    </div>\n  </div>\n</div>\n\n<div id="folien_frage" class="panel panel-primary">\n  <div class="panel-heading">\n    <h3 class="panel-title">Fragen</h3>\n  </div>\n  <div class="panel-body">\n\n    <div id="fragen-container">\n      <div class="frage-antwort">\n        <div class="frage">\n          <div class="date">Jun 10th, 2015</div>\n          Ist das so?\n        </div>\n        <div class="antworten">\n          <div class="antwort">\n            <div class="date">Jun 12th, 2015</div>\n            Antwort abc...!\n          </div>\n          <div class="antwort">\n            <div class="date">Jun 18th, 2015</div>\n            Das stimmt!\n          </div>\n        </div>\n        <div class="meineAntwort">\n          <form action="" method="POST">\n            <textarea placeholder="Geben Sie Ihre Antwort ein" style="width: 100%;" rows="2" name="antwortText"></textarea>\n            <input type="submit" value="Speichern" class="btn btn-success"/>\n          </form>\n        </div>\n      </div>\n    </div>\n    <div class="meineFrage">\n      <form action="" method="POST">\n        <textarea placeholder="Geben Sie Ihre Frage ein" style="width: 100%;" rows="5" name="frageText"></textarea>\n        <input type="submit" value="Speichern" class="btn btn-success"/>\n      </form>\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/fragenTemplate.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\n\t<h2>Fragen</h2>\t\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/impress_folienTemplate.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n\n<div id="folien_slide" class="panel panel-primary">\n  <div class="panel-heading">\n    <h3 class="panel-title">Slides</h3>\n  </div>\n  \n  <div class="panel-body">\n    <div id="impress-parent" class="jumbotron">\n      <div id="impress" class="steps"></div>\n    </div>\n  </div>\n</div>\n\n<div id="folien_notiz" class="panel panel-primary">\n  <div class="panel-heading">\n    <h3 class="panel-title">Notizen</h3>\n  </div>\n  <div class="panel-body">\n    Note</br>\n    Note</br>\n    Note</br>\n    Note</br>\n  </div>\n</div>\n\n<div id="folien_frage" class="panel panel-primary">\n  <div class="panel-heading">\n    <h3 class="panel-title">Fragen</h3>\n  </div>\n  <div class="panel-body">\n    Fragen</br>\n    Fragen</br>\n    Fragen</br>\n    Fragen</br>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/infoTemplate.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\n\t<h2>Info</h2>\t\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/materialTemplate.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\n\t<h2>Material</h2>\t\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/quizTemplate.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\n\t<h2>Quiz</h2>\t\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/videoTemplate.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\n\t<h2>Video</h2>\n</div>';

}
return __p
};