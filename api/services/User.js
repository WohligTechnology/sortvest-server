var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
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
    default:""
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
    type: String,
    default: ""
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
    var user = this(data);
    console.log(data);
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
      user.save(function(err, created) {
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
        callback(null, found);
      } else {
        callback(null, []);
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
