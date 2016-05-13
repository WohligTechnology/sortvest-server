
module.exports = {

  save: function(req, res) {
    if (req.body) {
      Funds.saveData(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  getOne: function(req, res) {

    if (req.body) {
      Funds.getOne(req.body, res.callback);
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
      Funds.deleteData(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  getAll: function(req, res) {
	
		if (req.body) {
				Funds.getAll(req.body, res.callback);
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
						Funds.findLimited(req.body, res.callback);
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
