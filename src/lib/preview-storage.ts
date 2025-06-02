import { PrismaClient } from "../generated/prisma";

export interface PreviewData {
  html: string;
  theme: string;
  originalUrl: string;
  originalScreenshot: string;
  transformedScreenshot: string;
  createdAt: string;
}

class PreviewStorage {
  private static instance: PreviewStorage;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): PreviewStorage {
    if (!PreviewStorage.instance) {
      PreviewStorage.instance = new PreviewStorage();
    }
    return PreviewStorage.instance;
  }

  public async set(id: string, data: PreviewData): Promise<void> {
    // Clean up old previews (older than 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    await this.prisma.previewData.deleteMany({
      where: {
        createdAt: {
          lt: oneHourAgo,
        },
      },
    });

    // Upsert the new preview data
    await this.prisma.previewData.upsert({
      where: { previewId: id },
      update: {
        html: data.html,
        theme: data.theme,
        originalUrl: data.originalUrl,
        originalScreenshot: data.originalScreenshot,
        transformedScreenshot: data.transformedScreenshot,
        updatedAt: new Date(),
      },
      create: {
        previewId: id,
        html: data.html,
        theme: data.theme,
        originalUrl: data.originalUrl,
        originalScreenshot: data.originalScreenshot,
        transformedScreenshot: data.transformedScreenshot,
      },
    });
  }

  public async get(id: string): Promise<PreviewData | null> {
    const result = await this.prisma.previewData.findUnique({
      where: { previewId: id },
    });

    if (!result) return null;

    return {
      html: result.html,
      theme: result.theme,
      originalUrl: result.originalUrl,
      createdAt: result.createdAt.toISOString(),
      originalScreenshot: result.originalScreenshot,
      transformedScreenshot: result.transformedScreenshot,
    };
  }

  public async getAll(): Promise<(PreviewData & { previewId: string })[]> {
    const results = await this.prisma.previewData.findMany({
      orderBy: { createdAt: "desc" },
    });
    return results.map((result) => ({
      html: result.html,
      theme: result.theme,
      originalUrl: result.originalUrl,
      createdAt: result.createdAt.toISOString(),
      previewId: result.previewId,
      originalScreenshot: result.originalScreenshot,
      transformedScreenshot: result.transformedScreenshot,
    }));
  }

  public async has(id: string): Promise<boolean> {
    const result = await this.prisma.previewData.findUnique({
      where: { previewId: id },
      select: { id: true },
    });
    return result !== null;
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.previewData.delete({
        where: { previewId: id },
      });
      return true;
    } catch {
      return false;
    }
  }

  public async clear(): Promise<void> {
    await this.prisma.previewData.deleteMany();
  }

  public async size(): Promise<number> {
    return await this.prisma.previewData.count();
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export const previewStorage = PreviewStorage.getInstance();
