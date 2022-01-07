const { Router } = require('express');
const products = require('../controllers/Products');
const {
  nameValidation,
  quantityValidation,
  docAlreadExists,
  docNotExists,
} = require('../middleware/ProductsValidation');

const router = Router();

router.post('/', nameValidation, quantityValidation, docAlreadExists, products.insertOne);

router.get('/', products.getAll);
router.get('/:id', products.getById);
router.put('/:id', nameValidation, quantityValidation, products.updateOne);
router.delete('/:id', docNotExists, products.deleteById);

module.exports = router;