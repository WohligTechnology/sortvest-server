var mongoose = require('mongoose');
var md5 = require('MD5');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    email: String,
    verifyemail: String,
    password: String,
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
        type: Number,
        default: 0
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
        default: ""
    },
    referred: {
        type: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'TempUser'
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

module.exports = mongoose.model('TempUser', schema);
var models = {
    saveData: function(data, callback) {
        if (data.password && data.password !== "") {
            data.password = md5(data.password);
        }
        var user = this(data);
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
                    TempUser.findOne({
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
                                var text = "";
                                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                                for (var i = 0; i < 12; i++) {
                                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                                }
                                user.verifyemail = md5(text);
                                var emailData = {};
                                emailData.email = data.email;
                                console.log(data);
                                emailData.content = "Hello, please click on the button below to verify your email :";
                                emailData.link = "http://sortvest2.com/verifyemail/" + text + "00x00" + TempUser.encrypt(data.email, 9);
                                emailData.filename = "emailverify.ejs";
                                emailData.subject = "Email Verification";
                                Config.email(emailData, function(err, emailRespo) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        console.log(emailRespo);
                                        user.save(function(err, data3) {
                                            if (err) {
                                                callback(err, null);
                                            } else {
                                                callback(null, data3);
                                            }
                                        });
                                    }
                                });
                                // user.save(function(err, data2) {
                                //   if (err) {
                                //     console.log(err);
                                //     callback(err, null);
                                //   } else {
                                //     TempUser.update({
                                //       mobile: data.referralCode
                                //     }, {
                                //       $push: {
                                //         referred: {
                                //           name: data2.name,
                                //           user: data2._id
                                //         }
                                //       },
                                //       points : found.points + 2000
                                //     }, function(err, saveres) {
                                //       if (err) {
                                //         console.log(err);
                                //         callback(err, null);
                                //       } else {
                                //         callback(null, data2);
                                //       }
                                //     });
                                //     // callback(null, data2);
                                //   }
                                // });
                            }
                        }
                    });

                } else {
                    callback(null, {
                        message: "TempUser already exists"
                    });
                }
            }
        });
    },
    emailVerification: function(data, callback) {
        var splitIt = data.verifyemail.split("00x00");
        var verify = splitIt[0];
        var email = TempUser.decrypt(splitIt[1], 9);
        TempUser.findOneAndUpdate({
            verifyemail: md5(verify),
            email: email
        }, {
            $set: {
                "verifyemail": ""
            }
        }, function(err, data2) {
            if (err) {
                callback(err, null);
            } else {
                if (!data2 && _.isEmpty(data2)) {
                    callback("User already verified", null);
                } else {
                    var updated = data2.toObject();
                    updated.verifyemail = "";
                    delete updated._id;
                    User.saveAsIs(updated,function(err, data2) {
                      if (err) {
                        console.log(err);
                        callback(err, null);
                      } else {
                        console.log(data2);
                        User.update({
                          mobile: updated.referralCode
                        }, {
                          $push: {
                            referred: {
                              name: data2.name,
                              user: data2._id
                            }
                          },
                          $inc:{
                            points:2000
                          }
                        }, function(err, saveres) {
                          console.log(saveres);
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
                    // User.saveData(updated, function(err, data4) {
                    //   if(err){
                    //     callback(err, data4);
                    //   }else if(data4){
                    //     var removeTemp = data2.toObject();
                    //     removeTemp.verifyemail= "";
                    //     TempUser.editProfile(removeTemp,function (err,done) {
                    //       callback(err,done);
                    //     }) ;
                    //   }else{
                    //     callback(err, data4);
                    //   }
                    // });
                }
            }
        });

    },
    encrypt: function(plaintext, shiftAmount) {
        var ciphertext = "";
        for (var i = 0; i < plaintext.length; i++) {
            var plainCharacter = plaintext.charCodeAt(i);
            if (plainCharacter >= 97 && plainCharacter <= 122) {
                ciphertext += String.fromCharCode((plainCharacter - 97 + shiftAmount) % 26 + 97);
            } else if (plainCharacter >= 65 && plainCharacter <= 90) {
                ciphertext += String.fromCharCode((plainCharacter - 65 + shiftAmount) % 26 + 65);
            } else {
                ciphertext += String.fromCharCode(plainCharacter);
            }
        }
        return ciphertext;
    },
    decrypt: function(ciphertext, shiftAmount) {
        var plaintext = "";
        for (var i = 0; i < ciphertext.length; i++) {
            var cipherCharacter = ciphertext.charCodeAt(i);
            if (cipherCharacter >= 97 && cipherCharacter <= 122) {
                plaintext += String.fromCharCode((cipherCharacter - 97 - shiftAmount + 26) % 26 + 97);
            } else if (cipherCharacter >= 65 && cipherCharacter <= 90) {
                plaintext += String.fromCharCode((cipherCharacter - 65 - shiftAmount + 26) % 26 + 65);
            } else {
                plaintext += String.fromCharCode(cipherCharacter);
            }
        }
        return plaintext;
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
                TempUser.getSession(data, function(err, data3) {
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
        TempUser.findOne({
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
                    TempUser.count({
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
                    TempUser.find({
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
