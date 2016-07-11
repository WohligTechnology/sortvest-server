module.exports = {

  save: function(req, res) {
    if (req.body) {
      TempUser.saveData(req.body, function(err, data) {
        if (err) {
          res.json({
            value: false,
            data: err
          });
        } else {
          if (data._id) {
            console.log(data);
            res.json({
              value: true,
              data: data
            });
          } else {
            res.json({
              value: false,
              data: data
            });
          }

        }
      });
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  getOne: function(req, res) {

    if (req.body) {
      TempUser.getOne(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  getSession: function(req, res) {
      if (req.body) {
          if (req.session.user) {
              req.body._id = req.session.user._id;
              TempUser.getSession(req.body, function(err, data) {
                  if (err) {
                      res.json({
                          value: false,
                          data: err
                      });
                  } else {
                      req.session.user = data;
                      res.json({
                          value: true,
                          data:  data
                      });
                  }
              });
          } else {
              res.json({
                  value: false,
                  data: "TempUser not logged in"
              });
          }
      } else {
          res.json({
              value: false,
              data: "Invalid Call"
          });
      }
  },
  emailVerification:function(){

  },
  login: function(req, res) {
    if (req.body) {
      if (req.body.email && req.body.email !== "" && req.body.password && req.body.password !== "") {
        TempUser.login(req.body, function(err, data) {
          if (err) {
            res.json({
              value: false,
              data: err
            });
          } else {
            if (data._id) {
              req.session.user = data;
              res.json({
                value: true,
                data: {
                  message: "Login Success"
                }
              });
            } else {
              res.json({
                value: false,
                data: {
                  message: "Invalid TempUsername/password"
                }
              });
            }
          }
        });
      } else {
        res.json({
          value: false,
          data: "Invalid Params"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  logout: function(req, res) {
    req.session.destroy(function(err) {
      if (err) {
        res.json({
          value: false,
          data: err
        });
      } else {
        res.json({
          value: true,
          data: {}
        });
      }
    });
  },
  getProfile: function(req, res) {
    if (req.session.user) {
      // console.log(JSON.stringify(req.session.user));
      res.json({
        value: true,
        data: req.session.user

      });
    } else {
      res.json({
        value: false,
        data: {}
      });
    }
  },
  logout: function(req, res) {
    req.session.destroy(function(err) {
      res.json({
        data: "Logout Successful",
        value: true
      });
    });
  },

  editProfile: function(req, res) {
    if (req.body) {
      if (req.session.user) {
        req.body._id = req.session.user._id;
        TempUser.editProfile(req.body, function(err, data) {
          if (err) {
            res.json({
              value: false,
              data: err
            });
          } else {
            req.session.user = data;
            res.json({
              value: true,
              data: {
                message: "user updated"
              }
            });
          }
        });
      } else {
        res.json({
          value: false,
          data: "TempUser not logged in"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid Call"
      });
    }
  },

  delete: function(req, res) {
    if (req.body) {
      console.log(req.body);
      TempUser.deleteData(req.body, res.callback);
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
      TempUser.getAll(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },
  getAllNominee: function(req, res) {
    function callback(err, data) {
      Global.response(err, data, res);
    }
    if (req.body) {
      TempUser.getAllNominee(req.body, res.callback);
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
        TempUser.findLimited(req.body, res.callback);
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
  }
};
