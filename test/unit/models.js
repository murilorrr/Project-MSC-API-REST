const { expect } = require("chai");
const { afterEach, beforeEach, it } = require("mocha");
const sinon = require("sinon");

/* Vamos importar o módulo responsável para abrir a conexão nos nossos models para poder fazer o seu `double`.*/
const { getConnection } = require("../models/mongoMock");
const { MongoClient } = require("mongodb");

const DBNAME = "StoreManager";
const PRODUCTSCOLLECTION = "products";

/*
  Como ainda não temos a implementação, vamos fixar
  um objeto simulando os métodos que iremos desenvolver,
  porém, eles não terão nenhum comportamento
*/
// const MoviesModel = {
//   insertOne: () => {},
//   getByName: () => {},
//   getById: () => {},
//   getAll: () => {},
//   decreseOne: () => {},
//   updateOne: () => {},
//   updateOneOnSales: () => {},
//   deleteOne: () => {},
// };

const operationsModel = require("../../models/Operations")("products");

describe("Testa todas as operações da camada de Modelo: ", () => {
  let connectionMock;

  beforeEach(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, "connect").resolves(connectionMock);
  });

  afterEach(async () => {
    await connectionMock.db("StoreManager").collection("products").drop();
    MongoClient.connect.restore();
  });

  describe("Insere um novo produto no BD", () => {
    const payloadProduct = {
      name: "batatinha",
      quantity: 123,
    };

    describe("quando é inserido com sucesso", () => {
      it("retorna um objeto", async () => {
        const response = await operationsModel.insertOne(payloadProduct);
        expect(response).to.be.a("object");
      });

      it('tal objeto possui o "_id" do novo produto inserido', async () => {
        const response = await operationsModel.insertOne(payloadProduct);

        expect(response).to.have.a.property("_id");
      });

      it("deve existir um produto com o nome cadastrado!", async () => {
        await operationsModel.insertOne(payloadProduct);
        const productCreated = await connectionMock
          .db(DBNAME)
          .collection(PRODUCTSCOLLECTION)
          .findOne({ name: payloadProduct.name });
        expect(productCreated).to.be.not.null;
      });
    });
  });
  // describe('quando não há produto inserido', () => {
  //   it('chamando a camada de model e inserindo com produto vazio', async () => {
  //     const response = await operationsModel.insertOne();
  //     console.log(response);

  //     expect(async () => await response).to.throw('parametro Vazio');
  //   });
  // });
  describe('pesquisa por um produto no BD com filtro de "name"', () => {
    const payloadProduct = {
      name: "batatinha",
      quantity: 123,
    };
    it("A pesquisa retorna um array", async () => {
      const productInserted = await operationsModel.insertOne(payloadProduct);
      const result = await operationsModel.getByName(productInserted.name);

      expect(result).to.be.a("array");
    });
    it("Espero que retorno o objeto que acabei de colocar na primeira posição", async () => {
      const productInserted = await operationsModel.insertOne(payloadProduct);
      const result = await operationsModel.getByName(productInserted.name);

      expect(result[0].name).to.equal("batatinha");
    });
    it('Tenha uma propriedade "id"', async () => {
      const productInserted = await operationsModel.insertOne(payloadProduct);
      const result = await operationsModel.getByName(productInserted.name);

      expect(result[0]._id).to.have.property("id");
    });
  });

  describe('pesquisa por um produto no BD com filtro de "id"', () => {
    const payloadProduct = {
      name: "batatinha",
      quantity: 123,
    };
    it('A pesquisa retorna um produto com o "id" filtrado', async () => {
      const productInserted = await operationsModel.insertOne(payloadProduct);
      const result = await operationsModel.getById(productInserted._id);

      expect(result).to.have.property("_id");
      expect(result.name).to.be.equal(productInserted.name);
    });
  });

  describe('pesquisa por todos os produtos no BD sem filtro', () => {
    const payloadProduct = [{
      name: "batatinha",
      quantity: 123,
    },
    {
      name: "casadinho",
      quantity: 2,
    },
    {
      name: "queijos",
      quantity: 4,
    }];

    it('A pesquisa retorna um array de produtos sem filtro', async () => {
      payloadProduct.map(async (el) => await operationsModel.insertOne(el));
      const result = await operationsModel.getAll();
      console.log(result[1].name);

      expect(result).to.be.a('array');
      expect(result.length).to.be.equal(3);
      expect(result[1].name).to.have.equal('casadinho');
    });
  });

  describe('deleta um produto no BD com filtro de "id"', () => {
    const payloadProduct = {
      name: "batatinha",
      quantity: 123,
    };
    it('A query retorna com o produto deletado', async () => {
      const productInserted = await operationsModel.insertOne(payloadProduct);
      const result = await operationsModel.deleteOne(productInserted._id);

      expect(result).to.have.property("_id");
      expect(result.name).to.be.equal(productInserted.name);
    });

    it('Verifica se o produto saiu do banco de dados', async () => {
      const productInserted = await operationsModel.insertOne(payloadProduct);
      const result = await operationsModel.deleteOne(productInserted._id);

      expect(result).to.have.property("_id");
      expect(result.name).to.be.equal(productInserted.name);

      const getDB = await operationsModel.getAll();

      expect(getDB).to.be.a('array').to.be.empty;
    });
  });

  describe('Testa a função de updateOne de um produto, realizando uma venda', () => {
    const payloadProduct = {
      "name": "cheetos",
      "quantity": 100,
    };

    it('retorna com o numero correto de decrescimento', async() => {
      const productInserted = await operationsModel.insertOne(payloadProduct);

      const payloadUpdate = {...productInserted, quantity: 2 };

      await operationsModel.updateOne(payloadUpdate._id, payloadUpdate);

      const result = await operationsModel.getById(productInserted._id);

      expect(result.quantity).to.equal(2);
    });
  });
});
