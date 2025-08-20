import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";

// Configure multer (here using memory storage, can also use diskStorage)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const Application = express();
const PORT = 5501;

// Middlewares
Application.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
}));
Application.use(express.json());
Application.use(express.urlencoded({ extended: true }));
Application.use("/images", express.static(path.join(__dirname, "assets")));

