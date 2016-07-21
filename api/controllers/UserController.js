module.exports = {

  save: function(req, res) {

    if (req.body) {
      User.saveData(req.body, function(err, data) {
        if (err) {
          res.json({
            value: false,
            data: err
          });
        } else {
          console.log(data);
          if (data._id) {
            req.session.user = data;
            res.json({
              value: true,
              data: {
                message: "Signup Success"
              }
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
      User.getOne(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },
  findOneNominee: function(req, res) {
    if (req.body) {
      User.findOneNominee(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },
  forgotPassword: function(req, res) {
      if (req.body) {
          if (req.body.email && req.body.email !== "") {
              User.forgotPassword(req.body, res.callback);
          } else {
              res.json({
                  value: false,
                  data: "Please provide email-id"
              });
          }
      } else {
          res.json({
              value: false,
              data: "Invalid Call"
          });
      }
  },
  saveNominee: function(req, res) {
    if (req.body) {
      User.saveNominee(req.body, function(err, respo) {
        if (err) {
          res.json({
            value: false,
            data: err
          });
        } else {
          res.json({
            value: true,
            data: respo
          });
        }
      });
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },

  deleteNominee: function(req, res) {
    if (req.body) {
      if (req.body._id && req.body._id !== "") {
        //	console.log("not valid");
        User.deleteNominee(req.body, function(err, respo) {
          if (err) {
            res.json({
              value: false,
              data: err
            });
          } else {
            res.json({
              value: true,
              data: respo
            });
          }
        });
      } else {
        res.json({
          value: false,
          data: "Invalid Id"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },

  getSession: function(req, res) {
      if (req.body) {
          if (req.session.user) {
              req.body._id = req.session.user._id;
              User.getSession(req.body, function(err, data) {
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
                  data: "User not logged in"
              });
          }
      } else {
          res.json({
              value: false,
              data: "Invalid Call"
          });
      }
  },


  login: function(req, res) {
    if (req.body) {
      if (req.body.email && req.body.email !== "" && req.body.password && req.body.password !== "") {
        User.login(req.body, function(err, data) {
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
                  message: "Invalid Username/password"
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
        User.editProfile(req.body, function(err, data) {
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
          data: "User not logged in"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid Call"
      });
    }
  },

  editProfileBackend: function(req, res) {
    if (req.body) {
        User.editProfileBackend(req.body, function(err, data) {
          if (err) {
            res.json({
              value: false,
              data: err
            });
          } else {
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
        data: "Invalid Call"
      });
    }
  },

  delete: function(req, res) {
    if (req.body) {
      console.log(req.body);
      User.deleteData(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  saveItAsIs: function(req, res) {
    if (req.body) {
      console.log(req.body);
      User.saveAsIs(req.body, res.callback);
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
      User.getAll(req.body, res.callback);
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
      User.getAllNominee(req.body, res.callback);
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },

  findNominee: function(req, res) {
    if (req.body) {
      User.findNominee(req.body, function(err, respo) {
        if (err) {
          res.json({
            value: false,
            data: err
          });
        } else {
          res.json({
            value: true,
            data: respo
          });
        }
      });
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
    // if (req.body) {
    //   User.getAllNominee(req.body, res.callback);
    // } else {
    //   res.json({
    //     value: false,
    //     data: "Invalid Request"
    //   });
    // }
  },
  findLimited: function(req, res) {
    if (req.body) {
      if (req.body.pagenumber && req.body.pagenumber !== "" && req.body.pagesize && req.body.pagesize !== "") {
        User.findLimited(req.body, res.callback);
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
