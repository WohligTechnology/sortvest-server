/**
 * GridController
 *
 * @description :: Server-side logic for managing grids
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */




module.exports = {
    checkthis: function(req,res) {
      console.log("Done");
      res.json({name:"Chintan"});
    },
    excelobject: function (req, res) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
            }
            if (db) {
                db.open(function (err, db) {
                    if (err) {
                        console.log(err);
                    }
                    if (db) {
                        res.connection.setTimeout(200000);
                        req.connection.setTimeout(200000);
                        var extension = "";
                        var excelimages = [];
                        req.file("file").upload({
                            maxBytes: 10000000000000000
                        }, function (err, uploadedFiles) {
                            if (err) {
                                console.log(err);
                            }
                            _.each(uploadedFiles, function (n) {
                                writedata = n.fd;
                                excelcall(writedata);
                            });
                        });

                        function excelcall(datapath) {
                            var outputpath = "./.tmp/output.json";
                            sails.xlsxj({
                                input: datapath,
                                output: outputpath
                            }, function (err, result) {
                                if (err) {
                                    console.error(err);
                                }
                                if (result) {
                                    console.log("in excel");
                                    console.log(result);
                                    sails.fs.unlink(datapath, function (data) {
                                        if (data) {
                                            sails.fs.unlink(outputpath, function (data2) {});
                                        }
                                    });

                                    function createteam(num) {
                                        m = result[num];

                                        /*  Grid.save(m, function (respo) {
                                              if (respo.value && respo.value == true) {
                                                  console.log(num);
                                                  num++;
                                                  if (num < result.length) {
                                                      setTimeout(function () {
                                                          createteam(num);
                                                      }, 15);
                                                  } else {
                                                      res.json("Done");
                                                  }
                                              }
                                          });*/
                                    }
                                    createteam(0);
                                }
                            });
                        }
                    }
                });
            }
        });
    },
    excelobject2: function (req, res) {
        var count=0;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
            }
            if (db) {
                db.open(function (err, db) {
                    if (err) {
                        console.log(err);
                    }
                    if (db) {
                        res.connection.setTimeout(200000);
                        req.connection.setTimeout(200000);
                        var extension = "";
                        var excelimages = [];
                        req.file("file").upload({
                            maxBytes: 10000000000000000
                        }, function (err, uploadedFiles) {
                            if (err) {
                                console.log(err);
                            }
                            _.each(uploadedFiles, function (n) {
                                writedata = n.fd;
                                excelcall(writedata);
                            });
                        });

                        function excelcall(datapath) {
                            var workbook = sails.xlsx.readFile(datapath);
                            var traverse = " ABCDEFGHIJKLMNOPQRSTUVWXYZ"; //space added for single cases
                            var char1 = 3;
                            var char2 = 0;
                            var ten = 1;
                            var currentColumn = traverse[char1] + traverse[char2];
                            var skip = false;
                            var split = parseInt(req.body.start);
                            var type= req.body.type;
                            for (var ch1 = 0; ch1 < 27; ch1++) {
                                for (var ch2 = 1; ch2 < 27; ch2++) {
                                    currentColumn = traverse[ch1] + traverse[ch2];
                                    if (workbook.Sheets.Sheet1[currentColumn.trim() + 4] == undefined) {
                                        skip = true;
                                        continue;

                                    } else {
                                        skip = false;
                                        var bulk = db.collection('grid').initializeOrderedBulkOp();

                                        for (var i = 1; workbook.Sheets.Sheet1[currentColumn.trim() + i] != undefined; i++) {
                                            bulk.insert({
                                                tenure: ten,
                                                path: split + i,
                                                value: parseFloat(workbook.Sheets.Sheet1[currentColumn.trim() + i].v * 100).toFixed(2),
                                                type: type
                                            });
                                            console.log((split+i)+" "+ ten);
                                            count++;
                                        }
                                        bulk.execute();
                                        ten++;
                                    }
                                }
                            }


                            console.log(count);
                            db.close();
                            res.json("done");
                        }
                    }
                });
            }
        });
    },
    save: function (req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    user();
                } else {
                    res.json({
                        value: false,
                        comment: "Grid-id is incorrect"
                    });
                }
            } else {
                user();
            }

            function user() {
                console.log(req.body);
                var print = function (data) {
                    res.json(data);
                }
                Grid.save(req.body, print);
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    delete: function (req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function (data) {
                    res.json(data);
                }
                Grid.delete(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Grid-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Grid.find(req.body, callback);
    },
    generateData: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Grid.generateData(req.body, callback);
    },
    generateDataByType: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Grid.generateDataByType(req.body, callback);
    },
    findone: function (req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function (data) {
                    res.json(data);
                }
                Grid.findone(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Grid-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findTenureByPath: function (req, res) {
        if (req.body) {
            if (req.body.type && req.body.type != "" && req.body.path && req.body.path != "") {
                var print = function (data) {
                    res.json(data);
                }
                Grid.findTenureByPath(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Grid-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findGridByType: function (req, res) {
      console.log(req.query);
      var print = function (data) {
          res.json(data);
      };
      Grid.findGridByType({type:req.query.id}, print);
    },
    findGridByType2: function (req, res) {
                var print = function (data) {
                    res.json(data);
                };
                Grid.findGridByType2({type:req.query.id}, print);

      },
    findlimited: function (req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                function callback(data) {
                    res.json(data);
                };
                Grid.findlimited(req.body, callback);
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    }
};
