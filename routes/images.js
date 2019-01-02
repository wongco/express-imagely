const { CLARIFAI_API_KEY } = require('../config');
const Clarifai = require('clarifai');
const express = require('express');
const router = new express.Router();

const clarifai = new Clarifai.App({ apiKey: CLARIFAI_API_KEY });
const cors = require('cors');

const GENERAL_MODEL = 'aa7f35c01e0642fda5cf400f543e7c40';
const COLOR_MODEL = 'eeed0b6733a644cea07cf4c60f87ebb7';

// allow CORS on all routes in this router page
router.use(cors());

/** default get on route /images */
router.post('/', async (req, res, next) => {
  const { encodedpic } = req.body;

  try {
    const result = await clarifai.models.predict(
      {
        id: Clarifai.GENERAL_MODEL,
        version: GENERAL_MODEL
      },
      {
        base64: encodedpic
      }
    );

    // clean up data from clarifai into nice output
    const relations = result.outputs[0].data.concepts.map(concept => {
      const { name, value } = concept;
      return { association: name, confidence: value };
    });

    // return clarifai relation data back to user
    return res.json({ relations });
  } catch (error) {
    return res.next(error);
  }
});

// exports router for app.js use
module.exports = router;
