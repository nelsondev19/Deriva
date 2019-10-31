const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');

const mongoose = require("mongoose");
const uuid = require('uuid/v4');
const multer = require("multer");
const fs = require('fs-extra');
const ctrl = {}





// initializations
const app = express();
require('./database');
require('./passport/local-auth');
require('dotenv').config();
// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');


const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/img'),
  filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname));
  }
});


// middlewares
// middlewares


app.use(multer({
  storage,
  dest: path.join(__dirname, 'public/img'),
  limits: {fileSize: 3000000},
  fileFilter: (req, file,cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error, lo que has intentado subir no es una imagen");
  }
}).single('img'));









app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: 'mysecretsession',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  console.log(app.locals)
  next();
});


const indexRoutes = require('./routes/index');
app.use(indexRoutes);

app.post('/upload', (req, res) => {
  console.log(req.file);
  res.send('upload')
})

// static files
 
app.use(express.static(path.join(__dirname, 'public')));



// routes
app.use('/', require('./routes/index'));


const indexRoutess = require('./routes/routes2');
app.use(indexRoutess);

const rutasCompra = require('./routes/producto-compra')

app.use(rutasCompra)

app.post('/upload', (req, res) => {
  console.log(req.file);
  res.send('upload')
})
// Starting the server
app.listen(app.get('port'), () => {
  console.log('server on port', app.get('port'));
});









