const express = require('express');
const product = require('../models/product');
const router = express.Router();


  router.get('/product-unico/:id',isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const products = await product.findById(id);
    //res.json(products)
    res.redirect('./products/producto-vista.ejs',{
      products
    })
     
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
} 



module.exports = router; 