const status = require('http-status-codes').StatusCodes;
const sales = require('../services/Sales');

const quantityValidation = ({ body }, res, next) => {
  const mapQuantity = body.map((el) => el.quantity);
  const haveString = mapQuantity.some((quantity) => !Number(quantity));
  if (haveString) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({
          err: {
            code: 'invalid_data',
            message: 'Wrong product ID or invalid quantity' } });
  }
  const lessThanZero = mapQuantity.some((quantity) => quantity <= 0);
  if (lessThanZero) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({
      err: {
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity',
      } });
  }
  return next();
};

const docNotExists = async (req, res, next) => {
  const { id } = req.params;
  const result = await sales.getById(id) || false;
  if (!result) {
    return res.status(422).json({
      err: {
        code: 'invalid_data',
        message: 'Wrong sale ID format',
      } });
  }
  return next();
};

// const idValidation = (req, res, next) => {
  // const { body } = req;
  // const mapProductsId = body.map((el) => el.productId);
  // mapProductsId.some((id) => haveInDataBase);
  // return next();
// };

module.exports = {
  quantityValidation,
  // idValidation,
  docNotExists,
};