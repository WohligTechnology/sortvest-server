/**
 * password.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String
});

module.exports = mongoose.model('Password', schema);
var models = {
    saveData: function(data, callback) {
        var password = this(data);
        if (data._id) {
            this.findOneAndUpdate({
                _id: data._id
            }, data, function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        } else {
            password.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        }
    },
    getAll: function(data, callback) {
        this.find({}, {}, {}).populate('parent').exec(function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
};
module.exports = _.assign(module.exports, models);
