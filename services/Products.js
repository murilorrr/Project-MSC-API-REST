const products = require('../models/Operations')('products');

const insertOne = async (product) => {
  const insertOperation = await products.insertOne(product);
  return insertOperation || null;
};

const getByName = async (name) => {
  const getOperation = await products.getByName(name);
  return getOperation || null;
};

const getById = async (id) => {
  const getOperation = await products.getById(id);
  return getOperation || null;
};

const getAll = async () => {
  const getOperation = await products.getAll();
  return getOperation || null;
};

const updateOne = async (id, product) => {
  const updateOperation = await products.updateOne(id, product);
  return updateOperation || null;
};

const deleteById = async (id) => {
  const deleteOperation = await products.deleteOne(id);
  return deleteOperation || null;
};

module.exports = {
  insertOne,
  updateOne,
  getByName,
  getById,
  getAll,
  deleteById,
};
