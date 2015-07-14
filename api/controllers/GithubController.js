

module.exports = {

  testSleep: function(req,res,next){
    var Fiber = require('fibers');

    function sleep(ms) {
      var fiber = Fiber.current;
      setTimeout(function() {
        fiber.run();
      }, ms);
      Fiber.yield();
    }

    Fiber(function() {
      console.log('wait... ' + new Date);
      sleep(1000);
      console.log('ok... ' + new Date);
    }).run();
    console.log('back in main');
  },

  testFiber: function(req,res,next){
    var repo = {};
    var githubName = "der-Alex85/tutorialSources";
    var githubToken = "223319831f859ff752e538f56ac8e76c648a31a1";
    require('js-github/mixins/github-db')(repo, githubName, githubToken);
    //require('js-git/mixins/mem-db')(repo);
    console.log("repo1: "+JSON.stringify(repo));
    require('js-git/mixins/create-tree')(repo);
    require('js-git/mixins/add-cache')(repo, require('js-git/mixins/indexed-db'));
    require('js-git/mixins/mem-cache')(repo);
    require('js-git/mixins/read-combiner')(repo);
    require('js-git/mixins/formats')(repo);

    //var headHash = repo.readRef("refs/heads/master");
    //var commit = repo.loadAs("commit", headHash);
    //var tree = repo.loadAs("tree", commit.tree);
    //var entry = tree["README.md"];
    //var readme = repo.loadAs("text", entry.hash);


    var Fiber = require('fibers');

    var f_headHash = Fiber(function(repo){
      console.log("repo: "+JSON.stringify(repo));
      var tmp = Fiber.yield(repo.readRef("refs/heads/master"));
      console.log("A : "+tmp);
    });

    var f_commit = Fiber(function(headHash){
      var tmp = Fiber.yield(repo.loadAs("commit", headHash));
      console.log("B : "+tmp);
    });

    var f_tree = Fiber(function(commit){
      var tmp = Fiber.yield(repo.loadAs("tree", commit.tree));
      console.log("C : "+tmp);
    });

    var f_entry = Fiber(function(tree){
      var tmp = Fiber.yield(tree["README.md"]);
      console.log("D : "+tmp);
    });

    //var f_readme = Fiber(function(entry){
    //  var tmp = Fiber.yield(repo.loadAs("text", entry.hash));
    //  console.log("E : "+tmp);
    //});


    var a = f_headHash.run(repo);
    console.log("q : "+a);

    //var b = f_commit.run(a);
    //var c = f_tree.run(b);
    //var d = f_entry.run(c);
    //var e = f_readme.run(d);



  },

  test: function(req,res,next){
    var repo = {};

    var githubName = "der-Alex85/tutorialSources";


    // Your user can generate these manually at https://github.com/settings/tokens/new
    // Or you can use an oauth flow to get a token for the user.
    var githubToken = "223319831f859ff752e538f56ac8e76c648a31a1";


    // Mixin the main library using github to provide the following:
    // - repo.loadAs(type, hash) => value
    // - repo.saveAs(type, value) => hash
    // - repo.readRef(ref) => hash
    // - repo.updateRef(ref, hash) => hash
    // - repo.createTree(entries) => hash
    // - repo.hasHash(hash) => has
    var github = require('js-github/mixins/github-db');

    github(repo, githubName, githubToken);


    require('js-git/mixins/mem-db')(repo);

    // Github has this built-in, but it's currently very buggy so we replace with
    // the manual implementation in js-git.
    require('js-git/mixins/create-tree')(repo);

    // Cache github objects locally in indexeddb
    require('js-git/mixins/add-cache')(repo, require('js-git/mixins/indexed-db'));

    // Cache everything except blobs over 100 bytes in memory.
    // This makes path-to-hash lookup a sync operation in most cases.
    require('js-git/mixins/mem-cache')(repo);

    // Combine concurrent read requests for the same hash
    require('js-git/mixins/read-combiner')(repo);

    // Add in value formatting niceties.  Also adds text and array types.
    require('js-git/mixins/formats')(repo);

    console.log("requre mem-db: " + JSON.stringify(repo));




/*
    var run = require('gen-run');
    run(function() {
      var headHash = yield repo.readRef("refs/heads/master");
      var commit = yield repo.loadAs("commit", headHash);
      var tree = yield repo.loadAs("tree", commit.tree);
      var entry = tree["README.md"];
      var readme = yield repo.loadAs("text", entry.hash);

      // Build the updates array
      var updates = [
        {
          path: "README.md", // Update the existing entry
          mode: entry.mode,  // Preserve the mode (it might have been executible)
          content: readme.toUpperCase() // Write the new content
        }
      ];
      // Based on the existing tree, we only want to update, not replace.
      updates.base = commit.tree;

      // Create the new file and the updated tree.
      var treeHash = yield repo.createTree(updates);

      var commitHash = yield repo.saveAs("commit", {
        tree: treeHash,
        author: {
          name: "Tim Caswell",
          email: "tim@creationix.com"
        },
        parent: headHash,
        message: "Change README.md to be all uppercase using js-github"
      });

      // Now we can browse to this commit by hash, but it's still not in master.
      // We need to update the ref to point to this new commit.

      yield repo.updateRef("refs/heads/master", commitHash);

    });
    */

  }





}
