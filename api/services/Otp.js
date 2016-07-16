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
        data.otp = (Math.random() + "").substring(2, 6);
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
                                url: "http://api-alerts.solutionsinfini.com/v3/?method=sms&api_key=A9da87d58f64f269c1fd24d7aafe36ba7&to=" + data.contact + "&sender=ApLion&message=Dear User, One Time Password (OTP) to complete your mobile number verification is " + data.otp + "&format=json"
                            }, function(err, http, body) {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                } else {
                                    console.log(body);
                                    callback(null, data2);
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
                                url: "http://api-alerts.solutionsinfini.com/v3/?method=sms&api_key=A9da87d58f64f269c1fd24d7aafe36ba7&to=" + data.contact + "&sender=ApLion&message=Dear User, One Time Password (OTP) to complete your mobile number verification is " + data.otp + "&format=json"
                            }, function(err, http, body) {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                } else {
                                    console.log(body);
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
        Otp.findOne({
            contact: data.contact,
            otp: data.otp,
            timestamp: {
                $gte: d
            }
        }, function(err, data2) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                if (data2 !== null) {
                    User.saveData(data, function(err, data3) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            callback(err, data3);
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
