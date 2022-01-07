const { Router } = require('express');
const sales = require('../controllers/Sales');
const { quantityValidation, docNotExists } = require('../middleware/SalesValidation');

const router = Router();

router.get('/', sales.getAll);
router.get('/:id', sales.getById);
router.post('/', quantityValidation, sales.insert);
router.put('/:id', quantityValidation, sales.updateOne);
router.delete('/:id', docNotExists, sales.deleteById);

module.exports = router;