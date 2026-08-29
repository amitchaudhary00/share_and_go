
import { Server } from "socket.io";
import MessageSocket from "./message.socket.mjs";
import { SocketAuthMiddleware } from "../middlewares/auth.socket.mjs";

export class InitializedSocket {
  constructor(applicationServer) {
    this.io = new Server(applicationServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
  }

  init() {
    this.chatConnection();
  }

  chatConnection = () => {
    const chatNamespace = this.io.of("/chat");

    // Apply auth middleware ONLY to /chat
    chatNamespace.use(SocketAuthMiddleware.jwtVerify);

    chatNamespace.on("connection", (socket) => {
      console.log("User connected to /chat:", socket.user?.id);

      // 🔥 Join personal room
      socket.join(socket.user.id.toString());

      console.log("Joined room:", socket.user.id.toString(), "Rooms:", socket.rooms);

      new MessageSocket(chatNamespace, socket);

      socket.on("disconnect", (reason) => {
        console.log("User disconnected:", reason);
      });
    });
  };
}
