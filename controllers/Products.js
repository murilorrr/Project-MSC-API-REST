const status = require('http-status-codes').StatusCodes;
const service = require('../services/Products');

const insertOne = async (req, res) => {
  const { name, quantity } = req.body;
  let result;
  try {
    result = await service.insertOne({ name, quantity });
  } catch (error) {
    return res.status(status.BAD_REQUEST).json({ message: error.message });
  }
  return result
    ? res.status(status.CREATED).json(result)
    : res.status(status.NOT_FOUND).json({ message: 'Json null' });
};

const getById = async (req, res) => {
  const { id } = req.params;
  let result;
  try {
    result = await service.getById(id);
  } catch (error) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({ message: error.message });
  }
  return result
    ? res.status(status.OK).json(result)
    : res.status(status.UNPROCESSABLE_ENTITY).json({
        err: {
          code: 'invalid_data',
          message: 'Wrong id format',
        },
      });
};

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
    ? res.status(status.OK).json({ products: result })
    : res.status(status.UNPROCESSABLE_ENTITY).json({ message: 'N encontrados' });
};

const updateOne = async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  let result;
  try {
    result = await service.updateOne(id, body);
  } catch (error) {
    return res.status(status.OK).json({ message: error.message });
  }
  return result
    ? res.status(status.OK).json(result)
    : res.status(status.NOT_FOUND).json({ message: 'Json null' });
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  let result;
  try {
    result = await service.deleteById(id);
  } catch (error) {
    return res.status(status.OK).json({ message: error.message });
  }
  return result
    ? res.status(status.OK).json(result)
    : res.status(status.NOT_FOUND).json({ message: 'Json null' });
};

module.exports = { insertOne, getById, getAll, updateOne, deleteById };
