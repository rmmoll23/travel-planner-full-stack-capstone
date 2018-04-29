const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Trip, ItemsDefault} = require('./models');
const {Item} = require('../items/models');

router.get('/:username', (req, res) => {
      Trip.find({username: req.params.username})
      .then(trips => {
        res.json(trips)
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: err });
      });
  });
  
  router.get('/:username/:tripName', (req, res) => {
      const name = req.params.tripName.replace('-', ' ');
      Trip.findOne({
          tripName: name,
          username: req.params.username
        })
      .then(trip => {
          res.json(trip)
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: err });
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
      .then(trips => {
        
            ItemsDefault.find()
              .then(defaultItems => {
                for (let i = 0; i < defaultItems.length; i++) {
                    Item.create({
                      itemName: defaultItems[i].itemName, 
                      username: req.body.username,
                      checked: defaultItems[i].checked,
                      category: defaultItems[i].category,
                      tripName: req.body.tripName
                    })
                      .then(items => console.log(items))
                      .catch(err => {
                        console.error(err);
                        res.status(500).json({ error: 'Item create inside the trip create loop failed due to' + err });
                      });
                }
              })
              .catch(err => {
                console.error(err);
                res.status(500).json({ error:'Item create inside the trip create loop failed due to' + err });
              });



        res.status(201).json(trips)
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Item create inside the trip create loop failed due to' + err });
      });
  
  });
  
  
  router.delete('/:username/:tripName', (req, res) => {
    Trip.findOneAndRemove({
      username: req.params.username, 
      tripName: req.params.tripName})
      .then(() => {
        res.status(204).json({ message: 'success' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: err });
      });
  });


module.exports = { router };