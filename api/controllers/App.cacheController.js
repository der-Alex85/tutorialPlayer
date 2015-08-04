/**
 * Created by Alex on 14.07.15.
 */


module.exports = {

  index: function(req,res) {

    var c = require('appcache-node');
    // generate a cache file
    var cf = c.newCache([
      'vendor/jquery/jquery.js',
      'vendor/jquery.validate/jquery.validate.js',
      'vendor/handlebars/handlebars.js',
      'vendor/bootstrap/bootstrap.js',
      'vendor/bootstrap-multiselect/bootstrap-multiselect.js',
      'vendor/sails.io.js/sails.io.js',
      'js/dependencies/jquery/customValidate.js',
      'js/dependencies/underscore.js',
      'js/reveal/lib/js/classList.js',
      'js/reveal/lib/js/head.min.js',
      'js/reveal/lib/js/html5shiv.js',
      'js/reveal/reveal.js',
      'js/customView.js',
      'js/positioning.js',
      'js/notizenFragen.js',
      'js/app.js',
      'vendor/bootstrap-multiselect/bootstrap-multiselect.css',
      'styles/bootstrap.css',
      'styles/importer.css',
      'styles/reveal-importer.css',
      'styles/reveal/theme/serif.css',
      'jst.js',
      '\n',
      'NETWORK:\n',
      '*'
    ]);

    // in your request handler
    //if(r.url.match(/app\.cache$/)){
    res.writeHead(200, {'Content-Type': 'text/cache-manifest'});
    return res.end(cf);
    //}
  }

}
