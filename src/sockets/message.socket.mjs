// sockets/message.socket.mjs
import model from "../db/index.db.mjs";

class MessageSocket {
  #webPushService;
  constructor(namespace, socket) {
    this.io = namespace;
    this.socket = socket;
    this.models = model;
    this.registerEvents();
  }

  registerEvents() {}
}

export default MessageSocket;
