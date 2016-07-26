var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var schema = new Schema({
    status: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    funds: [{
        fundid: {
            type: String,
            default: ""
        },
        purchaseprice: {
            type: String,
            default: ""
        },
        quantity: {
            type: String,
            default: ""
        }
    }],
    goalname: {
        type: String,
        default: ""
    },
    lumpsum: {
        type: Number,
        default: 0
    },
    monthly: {
        type: Number,
        default: 0
    },
    noOfMonth: {
        type: Number,
        default: 0
    },
    withdrawalfrequency: {
        type: String,
        default: ""
    },
    inflation: {
        type: Number,
        default: 0
    },
    installment: {
        type: Number,
        default: 0
    },
    noOfInstallment: {
        type: Number,
        default: 0
    },
    startMonth: {
        type: Number,
        default: 0
    },
    executiontime:{
      type:Date,
      default:Date.now()
    },
    shortinput: {
        type: Number,
        default: 0
    },
    longinput: {
        type: Number,
        default: 0
    },
    image:{
      type:String,
      default:""
    }
});

module.exports = mongoose.model('Portfolio', schema);

var models = {
    saveData: function(data, callback) {
        console.log(data);
        var portfolio = this(data);
        portfolio.timestamp = new Date();
        if (data._id) {
            this.findOneAndUpdate({
                _id: data._id
            }, data).exec(function(err, updated) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (updated) {
                  console.log(updated);
                    if(data.status ===  true){

                      User.findOneAndUpdate({
                        _id:data.user
                      },{
                        $addToSet:{
                          portfolios:data._id
                        }
                      },function (err,resp) {
                        console.log();
                        if(err){
                          callback(err,null);
                        }else{
                          var emailData = {};
                          emailData.email = "bagaria.pratik@gmail.com";
                          if(resp.name){
                            emailData.content = "Here is the Plan Executed by "+resp.name+ ". Contact : email :"+resp.email+" Mobile : "+resp.mobile;
                          }else{
                            emailData.content = "Here is the Plan Executed. Contact : email :"+resp.email+" Mobile : "+resp.mobile;
                          }
                          emailData.cc  = resp.email;
                          emailData.link = "";
                          emailData.lumpsum = data.lumpsum;
                          emailData.noOfMonth = moment(new Date(data.executiontime).setMonth(new Date(data.executiontime).getMonth()+data.noOfMonth)).format("MMM YY");
                          emailData.withdrawalStart = moment(new Date(data.executiontime).setMonth(new Date(data.executiontime).getMonth()+data.startMonth)).format("MMM YY");
                          emailData.withdrawalEnd = moment(new Date(data.executiontime).setMonth(new Date(data.executiontime).getMonth()+data.startMonth + data.noOfInstallment)).format("MMM YY");
                          emailData.lumpsum = data.lumpsum;
                          emailData.monthly = data.monthly;
                          emailData.inflation = data.inflation;
                          emailData.shortinput = data.shortinput;
                          emailData.longinput = data.longinput;
                          emailData.installment = data.installment;
                          emailData.withdrawalfrequency = data.withdrawalfrequency;
                          if(data.goalname){
                            emailData.goalname = data.goalname;
                          }else{
                            emailData.goalname = "";
                          }
                          console.log(emailData);
                          emailData.filename = "plannerexecute.ejs";
                          emailData.subject = "Plan Executed";
                          Config.email(emailData, function(err, emailRespo) {
                              if (err) {
                                  callback(err, null);
                              } else {
                                  callback(null,updated);
                              }
                          });
                        }
                      });
                    }else{
                      callback(null, updated);
                    }
                } else {
                    callback(null, {});
                }
            });
        } else {
            portfolio.save(function(err, created) {
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
        this.find({}).lean().exec(function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (found && found.length > 0) {
                _.each(found, function(n) {
                    n.type = "Portfolio";
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
                name: 1,
                email:1
            }
        }]).populate([{
            path: "funds",
            select: {
                _id: 1,
                name: 1
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

    getPortfolio: function(data, callback) {
        this.find({
            "user": data.user
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
    findLimited: function(data, callback) {
        console.log(data);
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        async.parallel([
                function(callback) {
                    Portfolio.count({
                        goalName: {
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
                    Portfolio.find({
                        goalName: {
                            '$regex': check
                        }
                    }).populate([{
                        path: "user",
                        select: {
                            _id: 1,
                            name: 1
                        }
                    }]).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).exec(function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (data2 && data2.length > 0) {
                            console.log(data2);
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
