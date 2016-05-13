
module.exports = {

  save: function(req, res) {
    if (req.body) {
      InvestmentType.saveData(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  getOne: function(req, res) {

    if (req.body) {
      InvestmentType.getOne(req.body, res.callback);
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
      InvestmentType.deleteData(req.body, res.callback);
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
				InvestmentType.getAll(req.body, res.callback);
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
						InvestmentType.findLimited(req.body, res.callback);
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
