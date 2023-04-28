const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');

const appRoutes = require('./routes/app');
const centralErrorHandler = require('./middlewares/centralErrorHandler');

const app = express();
const { PORT = 3000 } = process.env;

try {
  mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
} catch (err) {
  process.exit();
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(limiter);
app.use(express.json());

app.use(appRoutes);
app.use(errors());
app.use(centralErrorHandler);

app.listen(PORT);
