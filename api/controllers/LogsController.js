
module.exports = {

  save: function(req, res) {
    if (req.body) {
      Logs.saveData(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  getOne: function(req, res) {

    if (req.body) {
      Logs.getOne(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  delete: function(req, res) {
    if (req.body) {
      console.log(req.body);
      Logs.deleteData(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  getAll: function(req, res) {
		function callback(err, data) {
				Global.response(err, data, res);
		}
		if (req.body) {
				Logs.getAll(req.body, res.callback);
		} else {
				res.json({
						value: false,
						data: "Invalid Request"
				});
		}
  },
	findLimited: function (req, res) {
		if (req.body) {
				if (req.body.pagenumber && req.body.pagenumber !== "" && req.body.pagesize && req.body.pagesize !== "") {
						Logs.findLimited(req.body, res.callback);
				} else {
						res.json({
								value: false,
								data: "Please provide parameters"
						});
				}
		} else {
				res.json({
						value: false,
						data: "Invalid Request"
				});
		}
	},
};
