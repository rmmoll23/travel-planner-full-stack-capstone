const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuid = require('uuid/v1');
const {Photo} = require('../models');

router.get('/', (req, res) => {
      Photo.find()
      .then(photos => {
        res.json(photos);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });

router.get('/top', (req, res) => {
      Photo.find().sort({liked: -1})
      .then(photos => {
        res.json(photos);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });

router.get('/recent', (req, res) => {
      Photo.find().sort({date: -1})
      .then(photos => {
        res.json(photos);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
    });
  
  router.get('/:id', (req, res) => {
      Photo.findById(req.params.id)
      .then(photo => res.json(photo))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went horribly awry' });
      });
  });
  
  router.post('/', (req, res) => {
    const requiredFields = ['photoURL'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
      Photo.create({
          photoURL: req.body.photoURL, 
          date: new Date().toString(),
          liked: 0,
          id: uuid()
        })
      .then(photos => res.status(201).json(photos))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });
  
  
  router.delete('/:id', (req, res) => {
    Photo.findByIdAndRemove(req.params.id)
      .then(() => {
        res.status(204).json({ message: 'success' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  
  router.put('/:id', (req, res) => {
    const requiredFields = ['id'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.params)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    Photo.findByIdAndUpdate(req.params.id, { $inc: {'liked': 1} })
      .then(updatedPhoto => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });

module.exports = router;