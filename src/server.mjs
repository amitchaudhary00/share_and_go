import App from "./app.mjs";
import Env from "./config/env.js";
import { InitializedSocket } from "./sockets/index.mjs";
import { dbInstance } from "./db/dbConnection.mjs";

class Server {
  constructor() {
    this.app = new App().getInstance();
    this.instance = null;
  }

  start() {
    Env.validate();
    if (!this.app) return;
    this.instance = this.app.listen(Env.PORT, () => {
      console.log(`Server is running in port: ${Env.PORT}`);
    });
    if (this.server) {
      const webSockets = new InitializedSocket(this.server);
      webSockets.init();
    }
    this.registerShutdownHooks();
  }

  registerShutdownHooks() {
    process.on("SIGTERM", () => this.shutdown("SIGTERM"));
    process.on("SIGINT", () => this.shutdown("SIGINT"));
  }

  async shutdown(signal) {
    console.log(`${signal} received, shutting down gracefully`);
    await dbInstance.db_disconnect();
    this.instance.close(() => process.exit(0));
  }
}

new Server().start();
