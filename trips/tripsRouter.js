const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Trip} = require('./models');

router.get('/:username', (req, res) => {
      Trip.find({username: req.params.username})
      .then(trips => {
        res.json(trips);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  router.get('/:username', (req, res) => {
      Trip.findOne({tripName: req.body.tripName}, {username: req.params.username})
      .then(trip => res.json(trip))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went horribly awry' });
      });
  });
  
  router.post('/', (req, res) => {
    const requiredFields = ['username', 'tripName', 'location', 'tripLength'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
      Trip.create({
          username: req.body.username, 
          tripName: req.body.tripName,
          location: req.body.location,
          tripLength: req.body.tripLength
        })
      .then(trips => res.status(201).json(trips))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });
  
  
  router.delete('/:username', (req, res) => {
    Trip.findOneAndRemove({username: req.params.username}, {tripName: req.body.tripName})
      .then(() => {
        res.status(204).json({ message: 'success' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });


module.exports = { router };