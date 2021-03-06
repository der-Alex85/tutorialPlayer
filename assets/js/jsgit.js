var modes = require('js-git/lib/modes');

var repo = {};

require('js-git/mixins/mem-db')(repo);

// This adds a high-level API for creating multiple git objects by path.
// - createTree(entries) => hash
require('js-git/mixins/create-tree')(repo);

// This provides extra methods for dealing with packfile streams.
// It depends on
// - unpack(packStream, opts) => hashes
// - pack(hashes, opts) => packStream
require('js-git/mixins/pack-ops')(repo);

// This adds in walker algorithms for quickly walking history or a tree.
// - logWalk(ref|hash) => stream<commit>
// - treeWalk(hash) => stream<object>
require('js-git/mixins/walkers')(repo);

// This combines parallel requests for the same resource for effeciency under load.
require('js-git/mixins/read-combiner')(repo);

// This makes the object interface less strict.  See it's docs for details
require('js-git/mixins/formats')(repo);


console.log("REPO");
console.log(JSON.stringify(repo));
