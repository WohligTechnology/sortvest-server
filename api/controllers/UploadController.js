/**
 * UploadController
 *
 * @description :: Server-side logic for managing uploads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res) {
			 function callback2(err) {
					 Config.GlobalCallback(err, fileNames, res);
			 }
			 var fileNames = [];
			 req.file("file").upload({
					 maxBytes: 10000000 // 10 MB Storage 1 MB = 10^6
			 }, function(err, uploadedFile) {
					 if (uploadedFile && uploadedFile.length > 0) {
							 async.each(uploadedFile, function(n, callback) {
									 Config.uploadFile(n.fd, function(err, value) {
											 if (err) {
													 callback(err);
											 } else {
													 fileNames.push(value.name);
													 callback(null);
											 }
									 });
							 }, callback2);
					 } else {
							 callback2(null, {
									 value: false,
									 data: "No files selected"
							 });
					 }
			 });
	 },
	 readFile: function(req, res) {
			 Config.readUploaded(req.query.file, req.query.width, req.query.height, req.query.style, res);
	 },
};
