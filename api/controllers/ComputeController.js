/**
 * ComputeController
 *
 * @description :: Server-side logic for managing computes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	save: function(req, res) {
		if (req.body) {
			if (req.body._id) {
				if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
					user();
				} else {
					res.json({
						value: false,
						comment: "User-id is incorrect"
					});
				}
			} else {
				user();
			}

			function user() {
				var print = function(data) {
					res.json(data);
				}
				Compute.save(req.body, print);
			}
		} else {
			res.json({
				value: false,
				comment: "Please provide parameters"
			});
		}
	},
	delete: function(req, res) {
		if (req.body) {
			if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
				var print = function(data) {
					res.json(data);
				}
				Compute.delete(req.body, print);
			} else {
				res.json({
					value: false,
					comment: "User-id is incorrect"
				});
			}
		} else {
			res.json({
				value: false,
				comment: "Please provide parameters"
			});
		}
	},
	compute: function(req, res) {
		function callback(data) {
			res.json(data);
		}
		Compute.compute(req.body, false, callback);
	},
	generateCashflow: function(req, res) {
		var callback = [];
		Compute.generateCashflow(req.body, callback);
		res.json(callback);
	},
	generateAllPathTenure: function(req, res) {
		function callback(data) {
			res.json(data);
		}
		Compute.generateAllPathTenure(req.body, callback);
	},
	alltypes: function(req, res) {
		function callback(data) {
			res.json(data);
		}
		Compute.alltypes(req.body, callback);
	},
	alltypes2: function(req, res) {

		res.connection.setTimeout(1000000000);
		res.connection.setTimeout(1000000000);

		function callback(data) {
			res.json(data);
		}
		Compute.alltypes2(req.body, callback);
	},
	alltypes3: function(req, res) {
		function callback(data) {
			res.json(data);
		}
		Compute.alltypes2({
			"lumpsum": 100000,
			"monthly": 15000,
			"noOfMonth": 10,
			"startMonth": 13,
			"noOfInstallment": 15,
			"installment": 20000,
			"inflation": 6
		}, callback);
	},
	allpath: function(req, res) {
		function callback(data) {
			res.json(data);
		};
		var cashflow = [];
		Compute.generateCashflow(req.body, cashflow);
		Compute.allpath(req.body, cashflow, callback);
	},
	find: function(req, res) {
		function callback(data) {
			res.json(data);
		};
		Compute.find(req.body, callback);
	},
	generatePathData: function(req, res) {
		function callback(data) {
			res.json(data);
		};
		Compute.generatePathData(req.body, callback);
	},
	adminlogin: function(req, res) {
		function callback(data) {
			res.json(data);
		};
		Compute.adminlogin(req.body, callback);
	},
	findApproved: function(req, res) {
		function callback(data) {
			res.json(data);
		};
		Compute.findApproved(req.body, callback);
	},
	deleteRejected: function(req, res) {
		function callback(data) {
			res.json(data);
		};
		Compute.deleteRejected(req.body, callback);
	},
	findAwaitingApproval: function(req, res) {
		function callback(data) {
			res.json(data);
		};
		Compute.findAwaitingApproval(req.body, callback);
	},
	findRejected: function(req, res) {
		function callback(data) {
			res.json(data);
		};
		Compute.findRejected(req.body, callback);
	},
	findone: function(req, res) {
		if (req.body) {
			if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
				var print = function(data) {
					res.json(data);
				}
				Compute.findone(req.body, print);
			} else {
				res.json({
					value: false,
					comment: "User-id is incorrect"
				});
			}
		} else {
			res.json({
				value: false,
				comment: "Please provide parameters"
			});
		}
	},
	isModerator: function(req, res) {
		if (req.body) {
			if (req.body.moderator && req.body.moderator != "" && sails.ObjectID.isValid(req.body.moderator)) {
				var print = function(data) {
					res.json(data);
				}
				Compute.isModerator(req.body, print);
			} else {
				res.json({
					value: false,
					comment: "User-id is incorrect"
				});
			}
		} else {
			res.json({
				value: false,
				comment: "Please provide parameters"
			});
		}
	},
	findlimited: function(req, res) {
		if (req.body) {
			if (req.body.pagesize && req.body.pagesize !== "" && req.body.pagenumber && req.body.pagenumber !== "") {
				function callback(data) {
					res.json(data);
				};
				Compute.findlimited(req.body, callback);
			} else {
				res.json({
					value: false,
					comment: "Please provide parameters"
				});
			}
		} else {
			res.json({
				value: false,
				comment: "Please provide parameters"
			});
		}
	},
	calculateFV: function(req, res) {
		sails.finance.FV({
			rate: Math.abs(8),
			NPER: 10,
			PMT: 9
		}, function(err, response) {
			if (err) {
				console.log(err);
				res.send(err);
			} else if (response) {
				res.json(response);
			}
		});
	}
};
