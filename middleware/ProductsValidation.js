const products = require('../services/Products');

const nameAlreadyExists = (name, array) => array
.some((el) => el.name === name);

const nameValidation = async (req, res, next) => {
  const { name } = req.body;
  if (typeof name !== 'string' || name.length <= 5) {
    return res.status(422).json({
      err: {
        code: 'invalid_data',
        message: '"name" length must be at least 5 characters long',
      } });
  }
  return next();
};

const docAlreadExists = async (req, res, next) => {
  const { name } = req.body;
  const result = await products.getByName(name);
  const exists = nameAlreadyExists(name, result);
  if (exists) {
    return res.status(422).json({
      err: {
        code: 'invalid_data',
        message: 'Product already exists',
      } });
  }
  return next();
};

const docNotExists = async (req, res, next) => {
  const { id } = req.params;
  const result = await products.getById(id) || false;
  if (!result) {
    return res.status(422).json({
      err: {
        code: 'invalid_data',
        message: 'Wrong id format',
      } });
  }
  return next();
};

const quantityValidation = (req, res, next) => {
  const { quantity } = req.body;
  if (typeof quantity === 'string') {
    return res.status(422).json({
      err: {
        code: 'invalid_data',
        message: '"quantity" must be a number',
      },
     });
  }
  if (quantity <= 0) {
    return res.status(422).json({
      err: {
        code: 'invalid_data',
        message: '"quantity" must be larger than or equal to 1',
      },
    });
  }
  return next();
};

module.exports = {
  nameValidation,
  quantityValidation,
  docAlreadExists,
  docNotExists,
};
