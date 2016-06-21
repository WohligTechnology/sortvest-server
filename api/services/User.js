var mongoose = require('mongoose');
var md5 = require('MD5');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    email: String,
    password: String,
    mobile: String,
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
        pincode: {
            type: String,
            default: ""
        },
    }],
    dob: {
        type: Date,
        default: Date.now
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
        type: String,
        default: ""
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
        type: String,
        default: ""
    },
    referred: {
      type: [{
        name: String,
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
            mobile: data.mobile
        }, function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                // callback(null, data2);
                if (found === 0) {
                    user.save(function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            callback(null, data2);
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
                    callback(null, {});
                } else {
                    delete found.password;
                    callback(null, found);
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
        }, function(err, res) {
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
