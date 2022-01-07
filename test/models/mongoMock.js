const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const DBSERVER = new MongoMemoryServer();

const getConnection = async () => {
  const URLMock = await DBSERVER.getUri();
  const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    return MongoClient.connect(URLMock, OPTIONS);
  } catch (error) {
    console.error(err);
    process.exit();
  }
};

module.exports = { getConnection };