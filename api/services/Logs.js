var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    portfolio: {
        type: Schema.Types.ObjectId,
        ref: 'Portfolio',
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    quantity: {
        type: String,
        default: ""
    },
    amount: {
        type: String,
        default: ""
    },
    funds: {
        type: Schema.Types.ObjectId,
        ref: 'Funds',
        index: true
    }
});

module.exports = mongoose.model('Logs', schema);

var models = {
    saveData: function(data, callback) {
        var logs = this(data);
        logs.timestamp = new Date();
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
            logs.save(function(err, created) {
                if (err) {
                    callback(err, null);
                } else if (created) {
                    callback(null, created);
                } else {
                    callback(null, {});
                }
            });
        }
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
                    n.type = "logs";
                });
                callback(null, found);
            } else {
                callback(null, []);
            }
        });
    },
    getOne: function(data, callback) {
        this.findOne({
            "_id": data._id
        }).populate([{
            path: "user",
            select: {
                _id: 1,
                name: 1
            }
        }]).populate([{
            path: "funds",
            select: {
                _id: 1,
                name: 1
            }
        }]).populate([{
            path: "portfolio",
            select: {
                _id: 1,
                goalName: 1
            }
        }]).exec(function(err, found) {
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
    findLimited: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        async.parallel([
                function(callback) {
                    Logs.count({
                        amount: {
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
                    Logs.find({
                        amount: {
                            '$regex': check
                        }
                    }).populate([{
                        path: "user",
                        select: {
                            _id: 1,
                            name: 1
                        }
                    }]).populate([{
                        path: "funds",
                        select: {
                            _id: 1,
                            name: 1
                        }
                    }]).populate([{
                        path: "portfolio",
                        select: {
                            _id: 1,
                            goalName: 1
                        }
                    }]).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).exec(function(err, data2) {
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
