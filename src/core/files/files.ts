import { FileManager } from "./file-manager";
import * as fs from "fs";

const fileManager = new FileManager();

export function convertToBase64(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString("base64");
    return base64;
}

export async function saveFileToStorage(photo: Express.Multer.File): Promise<string> {
    const saveFile = await fileManager.uploadFile(photo);
    return saveFile.url;
}

export async function deleteFileFromStorage(url: string): Promise<boolean> {
    return fileManager.deleteFileByURL(url);
}