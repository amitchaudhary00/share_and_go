import fs from "fs";
import path from "path";
import morgan from "morgan";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logStream = fs.createWriteStream(path.join(logDir, "server.logs"), { flags: "a" });
const dev_logs = ":method :url :status :response-time ms :res[content-length]";
export const devApiLogs = morgan(dev_logs);
export const prodApiLogs = morgan("combined", {
  stream: logStream,
});
