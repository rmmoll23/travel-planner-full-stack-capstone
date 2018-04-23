const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Activity} = require('./models');

router.get('/:username/:tripName', (req, res) => {
      Activity.find({
        tripName: req.params.tripName, 
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
  
  
  router.delete('/:username/:tripName/:activityName/:day', (req, res) => {
    console.log(req.params.username, req.params.tripName, req.params.activityName, req.params.day);
    Activity.findOneAndRemove({
      username: req.params.username, 
      tripName: req.params.tripName, 
      activityName: req.params.activityName,
      day: req.params.day
    })
      .then((activity) => {
        console.log(activity);
        res.status(204).json({ message: 'success' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  
  router.put('/:username/:tripName/:activityName/:day', (req, res) => {

    const requiredFields = ['notes'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    Activity.findOneAndUpdate({
      username: req.params.username, 
      activityName: req.params.activityName, 
      tripName: req.params.tripName,
      day: req.params.day}, { $set: {'notes': req.body.notes} })
      .then(updatedNotes => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
      console.log(res);
  });

module.exports = { router };