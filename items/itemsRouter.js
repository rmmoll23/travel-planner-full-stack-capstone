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
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  router.post('/', (req, res) => {
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
  
  router.delete('/:username', (req, res) => {
    Item.findOneAndRemove({username: req.params.username}, {category: req.body.category}, {itemName: req.body.itemName}, {tripName: req.body.tripName})
      .then(() => {
        res.status(204).json({ message: 'success' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });

  router.put('/:username', (req, res) => {
    const requiredFields = ['itemName, category, checked, tripName'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    Activity.findOneAndUpdate({username: req.params.username}, {itemName: req.body.itemName}, {tripName: req.body.tripName}, {category: req.body.category}, {checked: req.body.checked}, { $set: {'checked': req.body.checked} })
      .then(updatedItem => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
      console.log(res);
  });

module.exports = { router };