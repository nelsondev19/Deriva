const router = require('express').Router();
const Product = require('../models/product');

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'djy2hxzcz',
  api_key: '911998631937127',
  api_secret: 'UgnTPqD2gwH_3G7e28ruc54Vmdk'
});
const fs = require('fs-extra');

router.get('/', (req, res, next) => {//ruta de inicio
  res.render('index');
});

router.get('/add-product', (req, res, next) => {
  res.render('products/add-product');
});

router.post('/add-product', async (req, res, next) => {//para subir productos a cloudinary
  const product = new Product();
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  console.log(result);
  product.category = req.body.category_name;
  product.name = req.body.product_name;
  product.price = req.body.product_price;
  product.imageURL = result.url;
  product.public_id = result.public_id
  //product.cover = faker.image.image();
  await product.save(); 
  await fs.unlink(req.file.path);
  
  res.redirect('/products/:page');
  
});

router.get('/products/:page', (req, res, next) => {
  let perPage = 9;
  let page = req.params.page || 1;

  Product
    .find({}) // muestra las colecciones de mongodb
    .skip((perPage * page) - perPage) //en la primera pagina valua si es cero
    .limit(perPage) // output just 9 items
    .exec((err, products) => {
      Product.count((err, count) => { // calcula el nuero de paginas
        if (err) return next(err);
        res.render('products/products', {
          products,
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    });
});


router.get('/turn/:id', async (req,res, next) =>{
  
  const estado = await Product.findById(req.params.id);
   estado.like = !estado.like;

   await estado.save().then((state) =>{console.log('se cambio el estado')}) 
                      .catch(err =>{console.log(err)});

   res.redirect('/products/1')  
});

module.exports = router; 
