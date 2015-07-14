module.exports = {

	

	':filename': function(req,res,next) {
		console.log('index mit namen'+req.param('filename'));
		var fs = require("fs");
		var filePath = "steps/"+req.param('filename');


		fs.exists(filePath, function(exists) {
      if (exists) {
				fs.stat(filePath, function(error, stats) {
        	fs.open(filePath, "r", function(error, fd) {
        		var buffer = new Buffer(stats.size);
 
        		fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
        			var data = buffer.toString("utf8", 0, buffer.length);
        			fs.close(fd);
        			return res.json(data);
        		});
        	});
        });
      }
    });

	}

	

}