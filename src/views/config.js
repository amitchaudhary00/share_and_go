require("dotenv").config();
const path = require("node:path");

// __dirname is already available natively in CommonJS — no need to derive it

class CONFIG {
  // App
  static TEMPLATE_ENGINE_PATH = path.join(__dirname);
  static TEMPLATE_ENGINE_PUBLIC = path.join(__dirname, "/public");
}
module.exports = CONFIG;
