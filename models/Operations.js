const { ObjectId } = require('mongodb');
const connection = require('./connection');

const insertOne = async (collection, product) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .insertOne(product));
    return result.ops.pop() || null;
  } catch (error) {
    return error.message;
  }
};

const getByName = async (collection, name) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .find({ name })
    .toArray());
    return result || null;
  } catch (error) {
    return error.message;
  }
};

const getById = async (collection, id) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .find({ _id: ObjectId(id) })
    .toArray());
    return result[0] || null;
  } catch (error) {
    return null;
  }
};

const getAll = async (collection) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .find({})
    .toArray());
    return result || null;
  } catch (error) {
    return error.message;
  }
};

const decreseOne = async (collection, id, product) => {
  try {
    const { quantity } = product;
    const result = await connection()
    .then((db) => db.collection(collection)
    .findOneAndUpdate(
      { _id: ObjectId(id) },
      { product: { $inc: -quantity } },
      { returnDocument: 'after' },
    ));
    return result.value || null;
  } catch (error) {
    console.log(error.message);
  }
};

const updateOne = async (collection, id, product) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: product },
      { returnDocument: 'after' },
    ));
    return result.value || null;
  } catch (error) {
    console.log(error.message);
  }
};

const updateOneOnSales = async (collection, id, product) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { itensSold: product } },
      { returnDocument: 'after' },
    ));
    return result.value || null;
  } catch (error) {
    console.log(error.message);
  }
};

const deleteOne = async (collection, id) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .findOneAndDelete(
      { _id: ObjectId(id) },
      { returnOriginal: 'after' },
    ));
    return result.value || null;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = (collection) => ({
    insertOne: (product) => insertOne(collection, product),
    getByName: (name) => getByName(collection, name),
    getById: (id) => getById(collection, id),
    getAll: () => getAll(collection),
    updateOne: (id, product) => updateOne(collection, id, product),
    decreseOne: (id, product) => decreseOne(collection, id, product),
    updateOneOnSales: (id, product) => updateOneOnSales(collection, id, product),
    deleteOne: (id) => deleteOne(collection, id),
});

// src https://github.com/tryber/sd-010-a-store-manager/pull/134/files
// src https://app.betrybe.com/course/live-lectures/sd-cohort-12