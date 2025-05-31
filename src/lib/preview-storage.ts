/* eslint-disable no-console */
import fs from "fs";
import path from "path";

export interface PreviewData {
  html: string;
  theme: string;
  originalUrl: string;
  createdAt: string;
}

class PreviewStorage {
  private static instance: PreviewStorage;
  private storage = new Map<string, PreviewData>();
  private storageFile = path.join(process.cwd(), ".preview-cache.json");

  private constructor() {
    this.loadFromFile();
  }

  public static getInstance(): PreviewStorage {
    if (!PreviewStorage.instance) {
      PreviewStorage.instance = new PreviewStorage();
    }
    return PreviewStorage.instance;
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.storageFile)) {
        const data = JSON.parse(fs.readFileSync(this.storageFile, "utf8"));
        this.storage = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn("Could not load preview cache:", error);
    }
  }

  private saveToFile() {
    try {
      const data = Object.fromEntries(this.storage);
      fs.writeFileSync(this.storageFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.warn("Could not save preview cache:", error);
    }
  }

  public set(id: string, data: PreviewData): void {
    // Clean up old previews (older than 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    for (const [key, value] of this.storage.entries()) {
      if (value.createdAt < oneHourAgo) {
        this.storage.delete(key);
      }
    }

    this.storage.set(id, data);
    this.saveToFile();
  }

  public get(id: string): PreviewData | undefined {
    return this.storage.get(id);
  }

  public has(id: string): boolean {
    return this.storage.has(id);
  }

  public delete(id: string): boolean {
    return this.storage.delete(id);
  }

  public clear(): void {
    this.storage.clear();
  }

  public size(): number {
    return this.storage.size;
  }
}

export const previewStorage = PreviewStorage.getInstance();
