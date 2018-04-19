'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ActivitySchema = mongoose.Schema({
  activityName: {type: String, required: true},
  username: {type: String, required: true},
  activityURL: {type: String, required: true},
  address: {type: String, required: true},
  day: {type: Number, required: true},
  notes: {type: String}
});

ActivitySchema.methods.serialize = function() {
  return {
    activityName: this.activityName,
    username: this.username,
    activityURL: this.activityURL,
    address: this.address,
    day: this.day,
    notes: this.notes
  };
};

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = {Activity};
