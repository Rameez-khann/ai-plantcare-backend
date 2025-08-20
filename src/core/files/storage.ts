import multer from "multer";
import path from "path";
import { generateUniqueId } from "victor-dev-toolbox";
import * as fs from "fs";

export const storageFolder = `assets/images`
// Configure Multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, storageFolder));
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         cb(null, `${generateUniqueId()}${ext}`); // unique filename
//     },
// });

// ensure directory exists
const uploadPath = path.join(__dirname, "../../..", "assets/images");
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // always use absolute path
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Create Multer middleware
export const storageConfig = multer({ storage });
