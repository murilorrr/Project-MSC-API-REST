const status = require('http-status-codes').StatusCodes;
const service = require('../services/Sales');

const getAll = async (req, res) => {
  let result;
  try {
    result = await service.getAll();
  } catch (error) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({
      err: {
        code: 'invalid_data',
        message: 'Wrong id format',
      },
    });
  }
  return result
    ? res.status(status.OK).json({ sales: result })
    : res
        .status(status.UNPROCESSABLE_ENTITY)
        .json({ message: 'N encontrados' });
};

const insert = async (req, res) => {
  const { body } = req;
  let result;
  try {
    result = await service.insert(body);
  } catch (error) {
    console.log('./sales insert', error.message);
    return res.status(status.BAD_REQUEST).json({ message: error.message });
  }
  return result
    ? res.status(status.OK).json(result)
    : res
        .status(status.NOT_FOUND)
        .json({
          err: {
            code: 'stock_problem',
            message: 'Such amount is not permitted to sell',
          },
        });
};

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await service.getById(id);
    return result
      ? res.status(status.OK).json(result)
      : res.status(status.NOT_FOUND).json({
          err: {
            code: 'not_found',
            message: 'Sale not found',
          },
        });
  } catch (error) {
    return res.status(status.BAD_REQUEST).json({ message: error.message });
  }
};

const updateOne = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const result = await service.updateOne(id, body);
    return result
      ? res.status(status.OK).json(result)
      : res.status(status.NOT_FOUND).json({
          err: {
            code: 'not_found',
            message: 'Sale not found',
          },
        });
  } catch (error) {
    return res.status(status.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await service.deleteOne(id);
    return result
      ? res.status(status.OK).json(result)
      : res.status(status.NOT_FOUND).json({
          err: {
            code: 'not_found',
            message: 'Sale not found',
          },
        });
  } catch (error) {
    return res.status(status.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  insert,
  getById,
  updateOne,
  deleteById,
};
