/**
 * Otp.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var request = require("request");
var schema = new Schema({
    contact: String,
    otp: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});
var d = new Date();
d.setMinutes(d.getMinutes() - 10);
module.exports = mongoose.model("Otp", schema);
var model = {
    saveData: function(data, callback) {
        data.otp = (Math.random() + "").substring(2, 8);
        var otp = this(data);
        this.count({
            contact: data.contact
        }, function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                if (found === 0) {
                    otp.save(function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            request.get({
                                url: "http://api-alerts.solutionsinfini.com/v3/?method=sms&api_key=Accfcbe3dd1296a7def430bb0678279b3&to=" + data.contact + "&sender=SRTVST&message=Dear User, One Time Password (OTP) to complete your mobile number verification is " + data.otp + "&format=json"
                            }, function(err, http, body) {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                } else {
                                    console.log(body);

                                    var resp = data2.toObject();
                                    delete resp.otp;
                                    callback(null, resp);
                                }
                            });
                        }
                    });
                } else {
                    data.timestamp = new Date();
                    Otp.findOneAndUpdate({
                        contact: data.contact
                    }, data, function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            request.get({
                                url: "http://api-alerts.solutionsinfini.com/v3/?method=sms&api_key=Accfcbe3dd1296a7def430bb0678279b3&to=" + data.contact + "&sender=SRTVST&message=Dear User, One Time Password (OTP) to complete your mobile number verification is " + data.otp + "&format=json"
                            }, function(err, http, body) {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                } else {
                                    console.log(body);
                                    delete data.otp;
                                    callback(null, data);
                                }
                            });
                        }
                    });
                }
            }
        });
    },
    checkOtp: function(data, callback) {
        Otp.findOneAndUpdate({
            contact: data.contact,
            otp: data.otp,
            timestamp: {
                $gte: d
            }
        },{
          $set:{
            otp:""
          }
        }, function(err, data2) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                if (data2 !== null) {
                  TempUser.findOneAndUpdate({
                    mobile: data.contact
                  },{
                    $set:{
                      "verifyotp":true
                    }
                  },function (err,data2) {
                    if(data2.verifyemail !== ""){
                      callback("Please complete email verification",null);
                    }else{
                      var updated = data2.toObject();
                      delete updated._id;
                      User.saveAsIs(updated, function(err, data2) {
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
                  });

                } else {
                    callback(null, {
                        message: "OTP expired"
                    });
                }
            }
        });
    },
};
module.exports = _.assign(module.exports, model);
