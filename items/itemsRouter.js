const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Item} = require('./models');

router.get('/:username/:tripName', (req, res) => {
      Item.find({
        username: req.params.username, 
        tripName: req.params.tripName
      })
      .then(items => {
        res.json(items);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: err });
      });
  });
  
  router.post('/', (req, res) => {
    console.log(req.body);
    const requiredFields = ['itemName', 'username', 'checked', 'category', 'tripName'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
      Item.create({
          itemName: req.body.itemName, 
          username: req.body.username,
          checked: req.body.checked,
          category: req.body.category,
          tripName: req.body.tripName
        })
      .then(items => res.status(201).json(items))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });
  
  router.delete('/:username/:tripName/:itemName/:category', (req, res) => {
    console.log(req.params);
    Item.findOneAndRemove({
      username: req.params.username, 
      category: req.params.category, 
      itemName: req.params.itemName, 
      tripName: req.params.tripName})
      .then(() => {
        res.status(204).json({ message: 'success' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: err });
      });
  });

  router.put('/:username/:tripName/:itemName/:category', (req, res) => {
    console.log(req.body.checked);
    
    const requiredFields = ['checked'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
    Item.findOneAndUpdate({
      username: req.params.username, 
      itemName: req.params.itemName, 
      tripName: req.params.tripName,
      category: req.params.category}, { $set: {'checked': req.body.checked} })
      .then(updatedItem => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
      // console.log(res);
  });

module.exports = { router };