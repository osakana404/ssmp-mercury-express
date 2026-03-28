import multer from "multer";
import path from "path";

// Описываем разрешенные форматы
const ALLOWED_TYPES = {
  "image/jpeg": "image",
  "image/jpg": "image",
  "image/png": "image",
  "image/gif": "image",
  "video/mp4": "video",
  "video/x-msvideo": "video", // это avi
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB в байтах
  },
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype);
    if (ALLOWED_TYPES[file.mimetype]) {
      cb(null, true); // Файл подходит, пропускаем
    } else {
      cb(
        new Error(
          "Недопустимый тип файла! Можно только JPG, PNG, GIF, MP4, AVI",
        ),
        false,
      );
    }
  },
});
