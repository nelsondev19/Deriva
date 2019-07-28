const path = require('path');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const uuid = require('uuid/v4');
const ctrl = {}

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/img'),
  filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname));
  }
});

const app = express();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/articles', {
  useMongoClient: true
}).then(() => console.log('conneted to db'))
.catch(err => console.log(err));



// setttings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

/*
ctrl.create = async (req, res) => {
  const imgUrl = randomNumber();
  console.log(imgUrl);
  const imageTempPath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const targetPath = path.resolve('src/public/upload/${imgUrl}${ext}')

  if (ext === '.png' || ext === 'jpg' || ext === '.jpeg')
  await fakerStatic.reename(imageTempPath, targetPath);
  const newimg = new image ({
    filename: imgUrl + ext
  });
  await newimg.save();
  console.log(newimg)
}
*/
// routes
const indexRoutes = require('./routes/index');
app.use(indexRoutes);

app.post('/upload', (req, res) => {
  console.log(req.file);
  res.send('upload')
})

// static files
 
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
app.listen(app.get('port'), () => {
  console.log('server on port', app.get('port'));
});

