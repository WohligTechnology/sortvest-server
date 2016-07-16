/**
 * OtpController
 *
 * @description :: Server-side logic for managing otps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            Otp.saveData(req.body, function(err, data) {
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
                data: "Invalid Call"
            });
        }
    },
    checkOtp: function(req, res) {
        if (req.body) {
            if (req.body.contact && req.body.contact != "") {
                Otp.checkOtp(req.body, function(err, data) {
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
                                data: { message: "signup success" }
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
                    data: "Invalid Params"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Call"
            });
        }
    }
};
