
module.exports = {

  mymodule: function(req,res, next) {
    console.log("start");
    var my = require('mytest/mix/mytest');
    my.abc();
    my.test();
    console.log("ende");
  },


  testGit: function(req, res, next) {

    var modes = require('js-git/lib/modes');
    var repo = {};

    require('js-git/mixins/mem-db')(repo);
    require('js-git/mixins/create-tree')(repo);
    require('js-git/mixins/pack-ops')(repo);
    require('js-git/mixins/walkers')(repo);
    require('js-git/mixins/read-combiner')(repo);
    require('js-git/mixins/formats')(repo);





    /*
    var run = require('gen-run');

    run(function*() {
      // Blocking logic goes here.  You can use yield
      var result = yield someAction(withArgs);
      // The generator pauses at yield and resumes when the data is available.
      // The rest of your process is not blocked, just this generator body.
      // If there was an error, it will throw into this generator.
    });

    someAction(withArgs, function (err, value) {
      if (err) return handleMyError(err);
      // do something with value
    });
    */






    /*

    var blobHash = yield repo.saveAs("blob", "Hello World\n");

    var treeHash = yield repo.saveAs("tree", {
      "greeting.txt": { mode: modes.file, hash: blobHash }
    });

    var commitHash = yield repo.saveAs("commit", {
      author: {
        name: "Tim Caswell",
        email: "tim@creationix.com"
      },
      tree: treeHash,
      message: "Test commit\n"
    });


    */

  }


}
