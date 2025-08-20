import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

// Configure multer (here using memory storage, can also use diskStorage)
const storage = multer.memoryStorage();
export const fileUploader = multer({ storage });

export const PORT = 5501;
export const Application = express();

// Middlewares
Application.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
}));
Application.use(express.json());
Application.use(express.urlencoded({ extended: true }));
// Application.use("/assets", express.static(path.join(__dirname, "/assets")));

// Application.use("/assets", express.static(path.join(__dirname, "assets")));

Application.use(
    "/assets",
    express.static(path.join(process.cwd(), "assets"))
);


