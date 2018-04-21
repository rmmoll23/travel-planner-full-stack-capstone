const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Activity} = require('./models');

router.get('/:username', (req, res) => {
      Activity.find({
        tripName: req.body.tripName, 
        username: req.params.username
      })
      .then(activities => {
        res.json(activities);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  
  router.post('/', (req, res) => {
    const requiredFields = ['activityName', 'username', 'activityURL', 'address', 'day', 'notes', 'tripName'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
      Activity.create({
        tripName: req.body.tripName,
        activityName: req.body.activityName,
        username: req.body.username,
        activityURL: req.body.activityURL,
        address: req.body.address,
        day: req.body.day,
        notes: req.body.notes
        })
      .then(activities => res.status(201).json(activities))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });
  
  
  router.delete('/:userName', (req, res) => {
    Activity.findOneAndRemove({username: req.params.username}, {day: req.body.day}, {tripName: req.body.tripName}, {activityName: req.body.activityName})
      .then(() => {
        res.status(204).json({ message: 'success' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  
  router.put('/:username', (req, res) => {
    const requiredFields = ['activityName, notes, tripName'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    Activity.findOneAndUpdate({username: req.params.username}, {activityName: req.body.activityName}, {notes: req.body.notes}, {tripName: req.body.tripName}, { $set: {'notes': req.body.notes} })
      .then(updatedMeme => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
      console.log(res);
  });

module.exports = { router };