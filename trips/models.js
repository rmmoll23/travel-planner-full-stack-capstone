// 'use strict';

// const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

// const PhotoSchema = mongoose.Schema({
//   photoURL: {type: String, required: true},
//   liked: {type: Number},
//   date: {type: Date, default: Date.now}
// });


// PhotoSchema.methods.serialize = function() {
//   return {
//     id: this._id,
//     photoURL: this.photoURL,
//     liked: this.liked,
//     date: this.date,
//   };
// };

// const Photo = mongoose.model('Photo', PhotoSchema);

// const MemeSchema = mongoose.Schema({
//     memeURL: {type: String, required: true},
//     liked: {type: Number},
//     date: {type: Date, default: Date.now},
//   });
  
  
//   MemeSchema.methods.serialize = function() {
//     return {
//       id: this._id,
//       memeURL: this.memeURL,
//       liked: this.liked,
//       date: this.date,
//     };
//   };
  
//   const Meme = mongoose.model('Meme', MemeSchema);
  

// module.exports = {Photo, Meme};