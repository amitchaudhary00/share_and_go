import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Env from "../config/env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class HandleFilesUpload {
  constructor() {
    this.profileUploadPath = path.resolve(__dirname, "../../assets/upload/profiles");
    this.folderException();
  }

  folderException = () => {
    try {
      if (!fs.existsSync(this.profileUploadPath)) {
        fs.mkdirSync(this.profileUploadPath, { recursive: true });
      }
    } catch (error) {
      throw new Error(
        `Failed to create directory for path:${this.profileUploadPath}`,
        error,
      );
    }
  };

  fileStorage = (filepath) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, filepath);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
      },
    });
    return storage;
  };

  fileFilter(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type"), false);
    }

    cb(null, true);
  }

  profileUpload = () => {
    const storage = this.fileStorage(this.profileUploadPath);
    return multer({
      storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1,
      },
    });
  };

  static generateProfileFileUrl = (req) => {
    const fileUrl = `${req.protocol}://${req.get("host")}/assets/upload/profiles/${req.file?.filename}`;
    return fileUrl;
  };

  static getDefaultProfileUrl = () => {
    const fileUrl = `${req.protocol}://${req.get("host")}/public/${Env.DEFAULT_PROFILE}`;
    return fileUrl;
  };
}

const uploadProfile = new HandleFilesUpload().profileUpload();
export { HandleFilesUpload, uploadProfile };
