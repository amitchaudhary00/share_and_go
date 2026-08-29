import mongoose from "mongoose";
import Env from "../config/env.js";

class InitializedDatabase {
  #mongoose = null;

  _init = () => {
    const { MONGODB_URI } = Env;

    if (!MONGODB_URI) throw new Error("MONGODB_URI is required");

    mongoose.set("strictQuery", true);

    // Optional: enable Mongoose debug logging (equivalent to your `logging` callback)
    mongoose.set("debug", (collectionName, method, query, doc) => {
      // console.log(`Mongoose: ${collectionName}.${method}`, JSON.stringify(query), doc);
    });

    this.#mongoose = mongoose;
    return this.#mongoose;
  };

  async db_sync() {
    try {
      await Promise.all(
        Object.values(mongoose.connection.models).map((model) => model.syncIndexes()),
      );
      console.log("Database indexes synced successfully");
    } catch (error) {
      console.error("Failed to sync database indexes:", error);
      process.exit(1);
    }
  }

  db_connect = async (retries = 5, delay = 1000) => {
    while (retries >= 0) {
      try {
        await mongoose.connect(Env.MONGODB_URI, {
          maxPoolSize: Env.MAX_POOL,
          minPoolSize: Env.MIN_POOL,
          socketTimeoutMS: Env.SOCKET_TIMEOUT,
          serverSelectionTimeoutMS: 10000,
          heartbeatFrequencyMS: 10000,
          retryWrites: true,
          retryReads: true,
          w: "majority",
          readPreference: "primaryPreferred",
        });
        console.log(`Db connected successfully`);
        return;
      } catch (error) {
        retries--;
        console.log(
          `Retrying to connect db [LEFT_RETRIES: ${retries + 1}] [DELAY: ${delay}]`,
        );
        if (retries === 0) {
          console.log("Failed to connect DB", error?.message || error);
          process.exit(1);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay += delay;
      }
    }
  };

  db_disconnect = async () => {
    if (this.#mongoose) await mongoose.connection.close();
    console.log("Database connection closed");
  };
}

const dbInstance = new InitializedDatabase();
const mongooseInstance = dbInstance._init();

export { dbInstance, mongooseInstance as mongoose };
