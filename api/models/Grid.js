/**
 * Grid.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
// var type0 = require('../../computedata/findGridByType0.json');
// var type10 = require('../../computedata/findGridByType10.json');
// var type20 = require('../../computedata/findGridByType20.json');
// var type30 = require('../../computedata/findGridByType30.json');
// var type40 = require('../../computedata/findGridByType40.json');
// var type50 = require('../../computedata/findGridByType50.json');
// var type60 = require('../../computedata/findGridByType60.json');
// var type70 = require('../../computedata/findGridByType70.json');
// var type80 = require('../../computedata/findGridByType80.json');
// var type90 = require('../../computedata/findGridByType90.json');
// var type100 = require('../../computedata/findGridByType100.json');




module.exports = {

  save: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        Grid.save(data, function() {
          callback({
            value: true,
            comment: "retried"
          });
        });
      } else if (db) {
        console.log(data);
        if (!data._id) {
          //                    console.log("in if");
          data._id = sails.ObjectID();
          db.collection('grid').insert(data, function(err, created) {
            if (err) {
              console.log(err);
              callback({
                value: false,
                comment: "Error"
              });
              db.close();

            } else if (created) {
              console.log("inside insert");
              callback({
                value: true,
                id: data._id
              });
              db.close();
            } else {
              callback({
                value: false,
                comment: "Not created"
              });
              db.close();
            }
          });
        } else {
          //                    console.log("in else");
          var grid = sails.ObjectID(data._id);
          delete data._id;
          db.collection('grid').update({
            _id: grid
          }, {
            $set: data
          }, function(err, updated) {
            if (err) {
              console.log(err);
              callback({
                value: false,
                comment: "Error"
              });
              db.close();
            } else if (updated.result.nModified !== 0 && updated.result.n !== 0) {
              callback({
                value: true
              });
              db.close();
            } else if (updated.result.nModified === 0 && updated.result.n !== 0) {
              callback({
                value: true,
                comment: "Data already updated"
              });
              db.close();
            } else {
              callback({
                value: false,
                comment: "No data found"
              });
              db.close();
            }
          });
        }
      }
    });
  },
  find: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("grid").find().limit(10000000000).toArray(function(err, found) {
          if (err) {
            callback({
              value: false
            });
            db.close();
          } else if (found && found[0]) {
            callback(found);
            db.close();
          } else {
            callback({
              value: false,
              comment: "No data found"
            });
            db.close();
          }
        });
      }
    });
  },
  generateData: function(data, callback) {
    var type = [{
      name: "0%",
      min: 94,
      max: 106
    }, {
      name: "10%",
      min: 95,
      max: 105
    }, {
      name: "20%",

      min: 96,
      max: 104
    }, {
      name: "30%",
      min: 97,
      max: 103
    }, {
      name: "40%",
      min: 98,
      max: 102
    }, {
      name: "50%",
      min: 99,
      max: 101
    }, {
      name: "60%",
      min: 100,
      max: 101
    }, {
      name: "70%",
      min: 93,
      max: 100
    }, {
      name: "80%",
      min: 100,
      max: 105
    }, {
      name: "90%",
      min: 92,
      max: 101
    }, {
      name: "100%",
      min: 91,
      max: 100
    }];
    var grid = {
      tenure: data.tenure,
      path: data.path,
      value: Math.floor(Grid.generateRandom(type[data.type].max, type[data.type].min)),
      type: type[data.type].name
    };
    if (data.tenure === 1 && data.path === 1 && data.type === 0) {
      Grid.save(grid, function(resp) {
        if (resp.value) {
          callback({
            value: true,
            comment: "Eureka!"
          });
        }
      });
    } else if (data.tenure == 1 && data.path == 1) {
      Grid.save(grid, function(resp) {
        if (resp.value) {
          data.tenure = data.maxtenure;
          data.path = data.maxpath;
          data.type = data.type - 1;
          Grid.generateData(data, callback);
        }
      });
    } else if (data.path == 1) {
      Grid.save(grid, function(resp) {
        if (resp.value) {
          data.tenure = data.tenure - 1;
          data.path = data.maxpath;
          Grid.generateData(data, callback);
        }
      });
    } else {
      Grid.save(grid, function(resp) {
        if (resp.value) {
          data.path = data.path - 1;
          Grid.generateData(data, callback);
        }
      });
    }
  },
  generateDataByType: function(data, callback) {
    var type = [{
      name: "0%",
      min: 94,
      max: 106
    }, {
      name: "10%",
      min: 95,
      max: 105
    }, {
      name: "20%",

      min: 96,
      max: 104
    }, {
      name: "30%",
      min: 97,
      max: 103
    }, {
      name: "40%",
      min: 98,
      max: 102
    }, {
      name: "50%",
      min: 99,
      max: 101
    }, {
      name: "60%",
      min: 100,
      max: 101
    }, {
      name: "70%",
      min: 93,
      max: 100
    }, {
      name: "80%",
      min: 100,
      max: 105
    }, {
      name: "90%",
      min: 92,
      max: 101
    }, {
      name: "100%",
      min: 91,
      max: 100
    }];
    var grid = {
      tenure: data.tenure,
      path: data.path,
      value: Math.floor(Grid.generateRandom(type[data.type].max, type[data.type].min)),
      type: type[data.type].name
    };
    if (data.tenure == 1 && data.path == 1) {
      Grid.save(grid, function(resp) {
        if (resp.value) {
          callback({
            value: true,
            comment: "Eureka!"
          });
        }
      });
    } else if (data.path == 1) {
      Grid.save(grid, function(resp) {
        if (resp.value) {
          data.tenure = data.tenure - 1;
          data.path = data.maxpath;
          Grid.generateDataByType(data, callback);
        }
      });
    } else {
      Grid.save(grid, function(resp) {
        if (resp.value) {
          data.path = data.path - 1;
          Grid.generateDataByType(data, callback);
        }
      });
    }
  },
  generateRandom: function(max, min) {
    return Math.random() * (max - min) + min;
  },
  //Findlimited
  findlimited: function(data, callback) {
    var newreturns = {};
    newreturns.data = [];
    var check = new RegExp(data.search, "i");
    var pagesize = parseInt(data.pagesize);
    var pagenumber = parseInt(data.pagenumber);
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        callbackfunc1();

        function callbackfunc1() {
          db.collection("grid").count({
            grid: {
              '$regex': check
            }
          }, function(err, number) {
            if (number && number !== "") {
              newreturns.total = number;
              newreturns.totalpages = Math.ceil(number / data.pagesize);
              callbackfunc();
            } else if (err) {
              console.log(err);
              callback({
                value: false
              });
              db.close();
            } else {
              callback({
                value: false,
                comment: "Count of null"
              });
              db.close();
            }
          });

          function callbackfunc() {
            db.collection("grid").find({
              grid: {
                '$regex': check
              }
            }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
              if (err) {
                callback({
                  value: false
                });
                console.log(err);
                db.close();
              } else if (found && found[0]) {
                newreturns.data = found;
                callback(newreturns);
                db.close();
              } else {
                callback({
                  value: false,
                  comment: "No data found"
                });
                db.close();
              }
            });
          }
        }
      }
    });
  },
  //Findlimited
  findone: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("grid").find({
          _id: sails.ObjectID(data._id)
        }).toArray(function(err, data2) {
          if (err) {
            console.log(err);
            callback({
              value: false
            });
            db.close();
          } else if (data2 && data2[0]) {
            delete data2[0].password;
            callback(data2[0]);
            db.close();
          } else {
            callback({
              value: false,
              comment: "No data found"
            });
            db.close();
          }
        });
      }
    });
  },
  //Findlimited
  findTenureByPath: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {

        db.collection("grid").find({
          path: data.path,
          type: data.type
        }).sort({
          "tenure": 1
        }).toArray(function(err, data2) {
          if (err) {
            console.log(err);
            callback({
              value: false
            });
            db.close();
          } else if (data2 && data2[0]) {
            callback(data2);
            db.close();
          } else {
            callback({
              value: false,
              comment: "No data found"
            });
            db.close();
          }
        });
      }
    });
  },
  //Findlimited
  findGridByType2: function(data, callback) {

    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {

        db.collection("grid").find({
          type: data.type
        }).toArray(function(err, data2) {
          if (err) {
            console.log(err);
            callback({
              value: false
            });
            db.close();
          } else if (data2 && data2[0]) {
            callback(data2);
            db.close();
          } else {
            callback({
              value: false,
              comment: "No data found"
            });
            db.close();
          }
        });
      }
    });
  },
  findGridByType: function(data, callback) {
    ch = data.type;
    var res;
    switch (ch) {
      case "0%":
        res = type0;
        break;
      case "10%":
        res = type10;
        break;
      case "20%":
        res = type20;
        break;
      case "30%":
        res = type30;
        break;
      case "40%":
        res = type40;
        break;
      case "50%":
        res = type50;
        break;
      case "60%":
        res = type60;
        break;
      case "70%":
        res = type70;
        break;
      case "80%":
        res = type80;
        break;
      case "90%":
        res = type90;
        break;
      case "100%":
        res = type100;
        break;
      default:
          res = type0;
          break;
    }

    callback(res);
  },
  delete: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      db.collection('grid').remove({
        _id: sails.ObjectID(data._id)
      }, function(err, deleted) {
        if (deleted) {
          callback({
            value: true
          });
          db.close();
        } else if (err) {
          console.log(err);
          callback({
            value: false
          });
          db.close();
        } else {
          callback({
            value: false,
            comment: "No data found"
          });
          db.close();
        }
      });
    });
  }
};
