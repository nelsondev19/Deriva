const path = require('path');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');


const app = express();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/articles', {
  useMongoClient: true
}).then(() => console.log('conneted to db'))
.catch(err => console.log(err));

// routes


// setttings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({
  dest: path.join(__dirname, 'public/img')
}).single('img'));

// routes
const indexRoutes = require('./routes/index');
app.use(indexRoutes);

app.post('/upload', (req, res) => {
  console.log(req.file);
  res.send('upload')
})
 
// starting the server
app.listen(app.get('port'), () => {
  console.log('server on port', app.get('port'));
});

