'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Photo} = require('../models');
const {app, runServer, closeServer} = require('../app');
const {TEST_DATABASE_URL, PORT} = require('../config');

chai.use(chaiHttp);

function seedPhotoData() {
  console.info('seeding Photo data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generatePhotoData());
  }
  // this will return a promise
  return Photo.insertMany(seedData);
}

function generatePhotoData() {
  return {
    photoURL: 'data:image/jpeg;base64,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',
    liked: 2,
    date: faker.date.recent()
  };
}

function tearDownDb() {
    return new Promise((resolve, reject) => {
      console.warn('Deleting database');
      mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

describe('Photos API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL, PORT);
  });

  beforeEach(function() {
    return seedPhotoData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });


describe('GET endpoint', function() {

    it('should return all Photos', function() {
     
      let res;
      return chai.request(app)
        .get('/photos')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
          res = _res;
          expect(res).to.have.status(200);
    //       // otherwise our db seeding didn't work
    //     //   console.log(res.body);
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);
        })
    });


    it('should return photos with right fields', function() {

      let resPhoto;
      return chai.request(app)
        .get('/photos')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);

          res.body.forEach(function(photo) {
            expect(photo).to.be.a('object');
            expect(photo).to.include.keys(
              '_id', 'photoURL', 'liked', 'date');
          });
        })
    });
  });

//   describe('POST endpoint', function() {

//     it('should add a new Photo', function() {

//       const newPhoto = generatePhotoData();

//       return chai.request(app)
//         .post('/photos')
//         .send(newPhoto)
//         .then(function(res) {
//           expect(res).to.have.status(201);
//           expect(res).to.be.json;
//           expect(res.body).to.be.a('object');
//           expect(res.body).to.include.keys(
//             'id', 'photoURL', 'liked', 'date');
//           expect(res.body.photoURL).to.equal(newPhoto.photoURL);
//           // cause Mongo should have created id on insertion
//           expect(res.body.id).to.not.be.null;
//           expect(res.body.liked).to.equal(newPhoto.liked);
//           expect(res.body.date).to.equal(newPhoto.date);

//           return Photo.findById(res.body.id);
//         })
//         .then(function(Photo) {
//           expect(Photo.photoURL).to.equal(newPhoto.photoURL);
//           expect(Photo.liked).to.equal(newPhoto.liked);
//           expect(Photo.date).to.equal(newPhoto.date);
//         });
//     });
//   });

  describe('PUT endpoint', function() {

    it('should update fields you send over', function() {
      const updateData = {
        liked: 3,
      };

      return Photo
        .findOne()
        .then(function(photo) {
          updateData.id = photo.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/photos/${photo.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Photo.findById(updateData.id);
        })
        .then(function(photo) {
          expect(photo.liked).to.equal(updateData.liked);
        });
    });
  });
  

//   describe('DELETE endpoint', function() {
   
//     it('delete a photo by id', function() {

//       let photo;

//       return Photo
//         .findOne()
//         .then(function(_photo) {
//           photo = _photo;
//           return chai.request(app).delete(`/photos/${photo.id}`);
//         })
//         .then(function(res) {
//           expect(res).to.have.status(204);
//           return Photo.findById(photo.id);
//         })
//         .then(function(_photo) {
//           expect(_photo).to.be.null;
//         });
//     });
//   });
});