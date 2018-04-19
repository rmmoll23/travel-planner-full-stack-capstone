'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const TripSchema = mongoose.Schema({
  username: {type: String, required: true},
  tripName: {type: String, required: true},
  location: {type: String, required: true},
  tripLength: {type: Number, required: true}
});


TripSchema.methods.serialize = function() {
  return {
    username: this.username,
    tripName: this.tripName,
    location: this.location,
    tripLength: this.tripLength
  };
};

const Trip = mongoose.model('Trip', TripSchema);
  

module.exports = {Trip};