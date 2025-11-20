require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Link = require('./models/Link.js');
const linksRouter = require('./routes/links.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Healthcheck
app.get('/healthz', (req, res) => {
  res.status(200).json({
    ok: true,
    version: '1.0',
    uptime: process.uptime(),
  });
});

// Stats page route: /code/:code -> serve stats.html
app.get('/code/:code', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});

// API routes
app.use('/api/links', linksRouter);

// Redirect route: /:code (must be after /api and /code routes)
app.get('/:code', async (req, res, next) => {
  const { code } = req.params;

  if (!code || code === 'favicon.ico') {
    return next();
  }

  try {
    const link = await Link.findOne({ code });

    if (!link) {
      return res.status(404).send('Not found');
    }

    // update click stats
    link.clicks += 1;
    link.lastClickedAt = new Date();
    await link.save();

    return res.redirect(302, link.targetUrl);
  } catch (err) {
    console.error('Error in redirect:', err);
    res.status(500).send('Internal server error');
  }
});

// Fallback to index.html for "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect DB and start server
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

