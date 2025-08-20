import { join } from "path";
import * as fs from "fs";
import { storageFolder } from "./storage";
import { PORT } from "../../application";

export class FileManager {
    private fileUploadsEndpoint = `http://127.0.0.1:${PORT}/${storageFolder}`;
    async uploadFile(
        file: Express.Multer.File,
        data?: any
    ): Promise<{ url: string; filename: string, response: any }> {
        const filename = file.filename;
        const url = `${this.fileUploadsEndpoint}/${filename}`;

        const responseData = {
            statusCode: 200,
            message: "Image Uploaded Successfully",
            data: url,
        };

        return { url, filename, response: responseData };
    }

    /**
     * Update a file (delete old file and upload new one)
     */
    async updateFile(
        fileURLToDelete: string,
        file: Express.Multer.File,
        data?: any
    ): Promise<{ url: string; response: any }> {
        const deleted = await this.deleteFileByURL(fileURLToDelete);
        if (!deleted) {
            throw new Error("Failed to delete file");
        }

        return this.uploadFile(file, data);
    }

    /**
     * Delete file by its URL
     */
    async deleteFileByURL(fileUrl: string): Promise<boolean> {
        const filePath = this.getFilePath(fileUrl);

        return new Promise<boolean>((resolve, reject) => {
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            } else {
                resolve(false);
            }
        });
    }


    private getFilePath(url: string): string {
        try {
            const parsed = new URL(url);
            // remove the leading slash so it matches your local FS path
            return parsed.pathname.replace(/^\/+/, "");
        } catch {
            // fallback if it's already a relative path
            return url;
        }
    }

    // private getFile(filePath: string): string {
    //     return join(__dirname, `../../../${storageFolder}`, filePath);
    // }




}
