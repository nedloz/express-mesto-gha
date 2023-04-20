const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsrouter = require('./routes/cards');

try {
  mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
} catch (err) {
  process.exit();
}
const app = express();

const { PORT = 3000, BASE_PATH } = process.env;

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '644109eaff4da83227c518ac',
  };
  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsrouter);

app.listen(PORT);
