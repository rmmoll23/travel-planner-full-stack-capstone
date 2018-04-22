'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ItemSchema = mongoose.Schema({
  category: {type: String, required: true},
  username: {type: String, required: true},
  itemName: {type: String, required: true},
  tripName: {type: String, required: true},
  checked: {type: String, required: true}
});

ItemSchema.methods.serialize = function() {
  return {
    tripName: this.tripName,
    itemName: this.itemName,
    username: this.username,
    checked: this.checked,
    category: this.category
  };
};

const Item = mongoose.model('Item', ItemSchema);

module.exports = {Item};
