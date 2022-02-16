// const helmet = require('helmet');
const csrf = require('csurf');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 3100

const app = express();

mongoose.connect(process.env.CONNECTIONSTRING)
.then(() => {
  app.emit('ready');
})
.catch(console.error);

const routes = require('./routes');
const { middleware, checkCSRF, csrfMiddleware } = require('./src/middlewares/middleware');

// app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
  secret: 'segredo',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());

// Nossos próprios middlewares
app.use(middleware);
app.use(checkCSRF);
app.use(csrfMiddleware);
app.use(routes);

app.on('ready', () => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
