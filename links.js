// routes/links.js
const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const validUrl = require('valid-url');

// helper to generate random code (6–8 chars)
function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 6; // you can randomize 6–8 if you want
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// POST /api/links - create link
router.post('/', async (req, res) => {
  try {
    const { targetUrl, code: customCode } = req.body;

    if (!targetUrl || !validUrl.isUri(targetUrl)) {
      return res.status(400).json({ error: 'Invalid or missing targetUrl' });
    }

    let code = customCode && customCode.trim();

    if (code) {
      // validate custom code
      if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
        return res.status(400).json({
          error: 'Code must match pattern [A-Za-z0-9]{6,8}',
        });
      }

      const exists = await Link.findOne({ code });
      if (exists) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    } else {
      // generate random code and make sure it's unique
      let unique = false;
      while (!unique) {
        code = generateRandomCode();
        const exists = await Link.findOne({ code });
        if (!exists) unique = true;
      }
    }

    const link = await Link.create({
      code,
      targetUrl,
    });

    return res.status(201).json(link);
  } catch (err) {
    console.error('Error creating link:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/links - list all
router.get('/', async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    console.error('Error listing links:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/links/:code - stats for one code
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json(link);
  } catch (err) {
    console.error('Error fetching link:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/links/:code - delete link
router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const deleted = await Link.findOneAndDelete({ code });

    if (!deleted) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.status(204).send(); // no content
  } catch (err) {
    console.error('Error deleting link:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

