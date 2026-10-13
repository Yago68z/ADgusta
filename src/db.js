const mongoose = require("mongoose");

let connectionPromise;

async function conectarBanco() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI não configurada. Crie o arquivo .env com a conexão do MongoDB.");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    }).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  await connectionPromise;
  return mongoose.connection;
}

module.exports = conectarBanco;
