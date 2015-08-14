/**
 * Created by Alex on 14.07.15.
 */


module.exports = {

  indexx: function(req,res) {

    var c = require('appcache-node');
    // generate a cache file
    var cf = c.newCache([
      'vendor/bootstrap-multiselect/bootstrap-multiselect.css',
      'styles/bootstrap.css',
      'styles/importer.css',
      'styles/reveal-importer.css',
      'styles/reveal/theme/serif.css',

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
      'js/notiz.js',
      'js/app.js',
      

      // 'video/videoA.mp4',
      // 'video/videoB.mp4',

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
