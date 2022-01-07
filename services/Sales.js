const sales = require('../models/Operations')('sales');
const productsModel = require('../models/Operations')('products');

const getAll = async () => {
  const getOperation = await sales.getAll();
  return getOperation || null;
};

const insert = async (body) => {
  const salesObject = {
    itensSold: body,
  };
  const productOne = await productsModel.getById(body[0].productId);
  const finalQuantity = productOne.quantity - body[0].quantity;
  if (finalQuantity < 0) return null;
  await productsModel.updateOne(body[0].productId, { ...productOne, quantity: finalQuantity });
  const insertOperation = await sales.insertOne(salesObject);
  return insertOperation || null;
};

const getById = async (id) => {
  const getOperation = await sales.getById(id);
  return getOperation || null;
};

const updateOne = async (id, products) => {
  const putOperation = await sales.updateOneOnSales(id, products);
  return putOperation || null;
};

const deleteOne = async (id) => {
  const salesObject = await sales.getById(id);

  const productOne = salesObject.itensSold[0];
  const productDentroDoBanco = await productsModel.getById(productOne.productId);
  const finalQuantity = productOne.quantity + productDentroDoBanco.quantity;
  await productsModel.updateOne(productOne.productId, { ...productOne, quantity: finalQuantity });
  const deleteOperation = await sales.deleteOne(id);
  return deleteOperation || null;
};

module.exports = { 
  getAll,
  insert,
  getById,
  updateOne,
  deleteOne,
};
