module.exports = {

  save: function(req, res) {
    if (req.body) {
      if (req.session.user) {
        req.body.user = req.session.user._id;
        Portfolio.saveData(req.body, function(err, data) {
          if (err) {
            res.json({
              value: false,
              data: err
            });
          } else {
            res.json({
              value: true,
              data: {
                message: "Portfolio created"
              }
            });
          }
        });
      } else {
        res.json({
          value: false,
          data: {
            message: "User not logged in"
          }
        });
      }
      // Portfolio.saveData(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  getOne: function(req, res) {
    if (req.body) {
      Portfolio.getOne(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  getPortfolio: function(req, res) {
    if (req.body) {
      if (req.session.user) {
        req.body.user = req.session.user._id;
        Portfolio.getPortfolio(req.body, function(err, data) {
          if (err) {
            res.json({
              value: false,
              data: err
            });
          } else {
            res.json({
              value: true,
              data: data
            });
          }
        });
      } else {
        res.json({
          value: false,
          data: {
            message: "User not logged in"
          }
        });
      }
    } else {
      res.json({
        value: false,
        data: {
          message: "Invalid request"
        }
      });
    }
  },
  delete: function(req, res) {
    if (req.body) {
      console.log(req.body);
      Portfolio.deleteData(req.body, res.callback);
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
      Portfolio.getAll(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },
  findLimited: function(req, res) {
    if (req.body) {
      if (req.body.pagenumber && req.body.pagenumber !== "" && req.body.pagesize && req.body.pagesize !== "") {
        Portfolio.findLimited(req.body, res.callback);
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
