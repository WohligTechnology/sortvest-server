var mongoose = require('mongoose');
var md5 = require('MD5');
var objectid = require("mongodb").ObjectId;
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    email: String,
    password: String,
    forgotpassword: {
        type: String,
        default: ""
    },
    mobile: String,
    forVerification: {
        type: Boolean,
        default: false
    },
    nominee: [{
        name: {
            type: String,
            default: ""
        },
        guardianName: {
            type: String,
            default: ""
        },
        guardianPan: {
            type: String,
            default: ""
        },
        dob: {
            type: Date,
            default: ""
        },
        relationship: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        country: {
            type: String,
            default: ""
        },
        pincode: {
            type: String,
            default: ""
        },
    }],
    dob: {
        type: Date,
        default: Date.now
    },
    placeofbirth: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    grossAnnualIncome: {
        type: String,
        default: ""
    },
    networth: {
        type: Number
    },
    occupation: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    politicalViews: {
        type: String,
        default: ""
    },
    taxResidency: {
        type: String,
        default: ""
    },
    maritalStatus: {
        type: String,
        default: ""
    },
    nationality: {
        type: String,
        default: ""
    },
    taxStatus: {
        type: String,
        default: ""
    },
    documents: {
        photo: {
            type: String,
            default: ""
        },
        addressproof: {
            type: String,
            default: ""
        },
        corraddressproof: {
            type: String,
            default: ""
        },
        addresstype: {
            type: String,
            default: ""
        },
        bankname: {
            type: String,
            default: ""
        },
        pan: {
            type: String,
            default: ""
        },
        cancelledcheque: {
            type: String,
            default: ""
        }
    },
    portfolios: [String],
    referralCode: {
        type: String,
        default: ""
    },
    points: {
        type: Number,
        default: 0
    },
    referred: {
        type: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }],
        index: true
    },
    notification: [{
        title: {
            type: String,
            default: ""
        },
        body: {
            type: String,
            default: ""
        }
    }]
});

module.exports = mongoose.model('User', schema);
var models = {
    saveData: function(data, callback) {
        if (data.password && data.password !== "") {
            data.password = md5(data.password);
        }
        var user = this(data);
        console.log(data);
        user.timestamp = new Date();
        this.count({
            mobile: data.mobile,
            email: data.email
        }, function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                // callback(null, data2);
                if (found === 0) {
                    User.findOne({
                        mobile: data.referralCode
                    }, function(err, found) {
                        if (err) {
                            console.log(err);
                        } else {
                            if (_.isEmpty(found)) {
                                callback(null, {
                                    message: "Invalid referralCode"
                                });
                            } else {
                                console.log("found", found);

                                user.save(function(err, data2) {
                                    if (err) {
                                        console.log(err);
                                        callback(err, null);
                                    } else {
                                        User.update({
                                            mobile: data.referralCode
                                        }, {
                                            $push: {
                                                referred: {
                                                    name: data2.name,
                                                    user: data2._id
                                                }
                                            },
                                            $inc: {
                                                points: 2000
                                            }
                                        }, function(err, saveres) {
                                            if (err) {
                                                console.log(err);
                                                callback(err, null);
                                            } else {
                                                // console.log(saveres);
                                                callback(null, data2);
                                            }
                                        });
                                        // callback(null, data2);
                                    }
                                });
                            }
                        }
                    });

                } else {
                    callback(null, {
                        message: "User already exists"
                    });
                }
            }
        });
    },
    saveAsIs: function(data, callback) {

        var user = this(data);
        user.timestamp = new Date();
        if (data._id) {
            this.findOneAndUpdate({
                _id: data._id
            }, data).exec(function(err, updated) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (updated) {
                    callback(null, updated);
                } else {
                    callback(null, {});
                }
            });
        } else {

            this.count({
                mobile: data.mobile,
                email: data.email
            }, function(err, found) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    if (found === 0) {
                        user.save(function(err, created) {
                            if (err) {
                                callback(err, null);
                            } else if (created) {
                                callback(null, created);
                            } else {
                                callback(null, {});
                            }
                        });

                    } else {
                        callback(null, {
                            message: "User already exists"
                        });
                    }
                }
            });
        }
    },

    saveNominee: function(data, callback) {
      var user = data.user;

      if (!data._id) {
        User.update({
          _id: user
        }, {
          $push: {
            nominee: data
          }
        }, function(err, updated) {
          if (err) {
            callback(err, null);
          } else if (updated) {
            callback(null, updated);
          }else{
            callback(null,null);
          }
        });
      } else {
        data._id = objectid(data._id);
        tobechanged = {};
        var attribute = "nominee.$.";
        _.forIn(data, function(value, key) {
          tobechanged[attribute + key] = value;
        });
        console.log(tobechanged);
        User.update({
          "nominee._id": data._id
        }, {
          $set: tobechanged
        }, function(err, updated) {
          if (err) {
            console.log(err);
            callback(err, null);
          } else {
            callback(null, updated);
          }
        });
      }
    },
    deleteNominee: function(data, callback) {
      User.update({
        "nominee._id": data._id
      }, {
        $pull: {
          "nominee": {
              "_id": objectid(data._id)
          }
        }
      }, function(err, updated) {
        console.log(updated);
        if (err) {
          callback(err, null);
        } else {
          callback(null, updated);
        }
      });

    },
    deleteData: function(data, callback) {
        this.findOneAndRemove({
            _id: data._id
        }, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else if (deleted) {
                callback(null, deleted);
            } else {
                callback(null, {});
            }
        });
    },
    getAll: function(data, callback) {
        this.find({}).exec(function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (found && found.length > 0) {


                _.each(found, function(n) {
                    console.log("In loop");
                    n.type = "user";
                });
                callback(null, found);
            } else {
                callback(null, []);
            }
        });
    },
    getAllNominee: function(data, callback) {
        this.findOne({
            _id: data._id
        }, {
            nominee: 1,
            _id: 1
        }).lean().exec(function(err, found) {
          console.log(found);
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, {});

            } else {
                found.user = found._id;
                callback(null, found);
            }
        });
    },
    findOneNominee: function(data, callback) {
      // aggregate query
      User.aggregate([{
        $unwind: "$nominee"
      }, {
        $match: {
          "nominee._id": objectid(data._id)
        }
      }, {
        $project: {
          nominee: 1
        }
      }]).exec(function(err, respo) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else if (respo && respo.length > 0 && respo[0].nominee) {
          callback(null, respo[0].nominee);
        } else {
          callback({
            message: "No data found"
          }, null);
        }
      });
    },

    findNominee: function(data, callback) {
      var newreturns = {};
      newreturns.data = [];
      var check = new RegExp(data.search, "i");
      data.pagenumber = parseInt(data.pagenumber);
      data.pagesize = parseInt(data.pagesize);
      var skip = parseInt(data.pagesize * (data.pagenumber - 1));
      async.parallel([
          function(callback) {
            User.aggregate([{
              $match: {
                _id: objectid(data._id)
              }
            }, {
              $unwind: "$nominee"
            }, {
              $group: {
                _id: null,
                count: {
                  $sum: 1
                }
              }
            }, {
              $project: {
                count: 1
              }
            }]).exec(function(err, result) {
              console.log(result);
              if (result && result[0]) {
                newreturns.total = result[0].count;
                newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
                callback(null, newreturns);
              } else if (err) {
                console.log(err);
                callback(err, null);
              } else {
                callback({
                  message: "Count of null"
                }, null);
              }
            });
          },
          function(callback) {
            User.aggregate([{
              $match: {
                _id: objectid(data._id)
              }
            }, {
              $unwind: "$nominee"
            }, {
              $group: {
                _id: "$_id",
                nominee: {
                  $push: "$nominee"
                }
              }
            }, {
              $project: {
                _id: 0,
                nominee: {
                  $slice: ["$nominee", skip, data.pagesize]
                }
              }
            }]).exec(function(err, found) {
              console.log(found);
              if (found && found.length > 0) {
                newreturns.data = found[0].nominee;
                callback(null, newreturns);
              } else if (err) {
                console.log(err);
                callback(err, null);
              } else {
                callback({
                  message: "Count of null"
                }, null);
              }
            });
          }
        ],
        function(err, data4) {
          if (err) {
            console.log(err);
            callback(err, null);
          } else if (data4) {
            callback(null, newreturns);
          } else {
            callback(null, newreturns);
          }
        });
    },
    getOne: function(data, callback) {
        this.findOne({
            "_id": data._id
        }).exec(function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (found && Object.keys(found).length > 0) {

                callback(null, found);
            } else {
                callback(null, {});
            }
        });
    },
    forgotPassword: function(data, callback) {
        this.findOne({
            email: data.email
        }, {
            password: 0,
            forgotpassword: 0
        }, function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                if (found) {
                    if (!found.oauthLogin || (found.oauthLogin && found.oauthLogin.length <= 0)) {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 8; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        var encrypttext = md5(text);
                        User.findOneAndUpdate({
                            _id: found._id
                        }, {
                            forgotpassword: encrypttext
                        }, function(err, data2) {
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                var emailData = {};
                                emailData.email = data.email;
                                console.log('data.email', data.email);
                                emailData.content = "Your new password for the Sortvest website is: " + text + ".Please note that this is a system generated password which will remain valid for 3 hours only. Kindly change it to something you would be more comfortable remembering at the earliest.";
                                emailData.filename = "forgotpassword.ejs";
                                emailData.subject = "Forgot Password";
                                Config.email(emailData, function(err, emailRespo) {
                                    if (err) {
                                        console.log(err);
                                        callback(err, null);
                                    } else {
                                        console.log(emailRespo);
                                        callback(null, {
                                            comment: "Mail Sent"
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        callback(null, {
                            comment: "User logged in through social login"
                        });
                    }
                } else {
                    callback(null, {
                        comment: "User not found"
                    });
                }
            }
        });
    },

    login: function(data, callback) {
        this.findOne({
            email: data.email,
            password: md5(data.password)
        }).lean().exec(function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                if (_.isEmpty(found)) {
                    console.log(found);
                    User.findOne({
                        email: data.email,
                        forgotpassword: md5(data.password)
                    }, function(err, data4) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            console.log(data4);
                            if (_.isEmpty(data4)) {
                                callback(null, {
                                    comment: "User Not Found"
                                });
                            } else {
                                console.log('Hererereaeaopdiasopidapsodipaos');
                                User.findOneAndUpdate({
                                    _id: data4._id
                                }, {
                                    password: md5(data.password),
                                    forgotpassword: ""
                                }, function(err, data5) {
                                    if (err) {
                                        console.log(err);
                                        callback(err, null);
                                    } else {
                                        data5.password = "";
                                        data5.forgotpassword = "";
                                        callback(null, data5);
                                    }
                                });
                            }
                        }
                    });
                } else {
                    User.findOneAndUpdate({
                        _id: found._id
                    }, {
                        forgotpassword: ""
                    }, function(err, data3) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            data3.password = "";
                            data3.forgotpassword = "";
                            callback(null, data3);
                        }
                    });
                }
            }
        });
    },
    editProfile: function(data, callback) {
        delete data.password;
        data.modificationDate = new Date();
        this.findOneAndUpdate({
            _id: data._id
        }, data, function(err, data2) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                // callback(null, data);
                User.getSession(data, function(err, data3) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        callback(null, data3);
                    }
                });
            }
        });
    },
    getSession: function(data, callback) {
        User.findOne({
            _id: data._id
        }).populate("referred.user", "name email", null, {
            sort: {
                "name": 1
            }
        }).lean().exec(function(err, res) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, res);
            }
        });
    },
    findLimited: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        async.parallel([
                function(callback) {
                    User.count({
                        occupation: {
                            '$regex': check
                        }
                    }).exec(function(err, number) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (number && number !== "") {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / data.pagesize);
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                },
                function(callback) {
                    User.find({
                        occupation: {
                            '$regex': check
                        }
                    }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).exec(function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (data2 && data2.length > 0) {
                            newreturns.data = data2;
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                }
            ],
            function(err, data4) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (data4) {
                    callback(null, newreturns);
                } else {
                    callback(null, newreturns);
                }
            });
    }
};

module.exports = _.assign(module.exports, models);
