import { PrismaClient } from "../generated/prisma";
import { PreviewData } from "./types";

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
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    await this.prisma.previewData.deleteMany({
      where: {
        createdAt: {
          lt: oneHourAgo,
        },
      },
    });

    await this.prisma.previewData.upsert({
      where: { previewId: id },
      update: {
        url: data.url,
        screenshot: data.screenshot,
        metadata: {
          title: data.metadata.title,
          description: data.metadata.description,
          keywords: data.metadata.keywords,
          language: data.metadata.language,
        },
        structure: data.structure,
        styles: data.styles,
        extractedAt: new Date(data.extractedAt),
        html: data.html,
        transformedHtml: data.transformedHtml,
        transformedScreenshot: data.transformedScreenshot,
        theme: data.theme,
        transformedAt: new Date(data.transformedAt),
        updatedAt: new Date(),
      },
      create: {
        previewId: id,
        url: data.url,
        screenshot: data.screenshot,
        metadata: {
          title: data.metadata.title,
          description: data.metadata.description,
          keywords: data.metadata.keywords,
          language: data.metadata.language,
        },
        structure: data.structure,
        styles: data.styles,
        extractedAt: new Date(data.extractedAt),
        html: data.html,
        transformedHtml: data.transformedHtml,
        transformedScreenshot: data.transformedScreenshot,
        theme: data.theme,
        transformedAt: new Date(data.transformedAt),
      },
    });
  }

  public async get(id: string): Promise<PreviewData | null> {
    const result = await this.prisma.previewData.findUnique({
      where: { previewId: id },
    });

    if (!result) return null;

    return {
      url: result.url,
      screenshot: result.screenshot,
      metadata: {
        title: result.metadata.title,
        description: result.metadata.description,
        keywords: result.metadata.keywords,
        language: result.metadata.language,
      },
      structure: result.structure,
      styles: result.styles,
      extractedAt: result.extractedAt.toISOString(),
      html: result.html,
      transformedHtml: result.transformedHtml,
      transformedScreenshot: result.transformedScreenshot,
      theme: result.theme,
      transformedAt: result.transformedAt.toISOString(),
    };
  }

  public async getAll(): Promise<(PreviewData & { previewId: string })[]> {
    const results = await this.prisma.previewData.findMany({
      orderBy: { createdAt: "desc" },
    });

    return results.map((result) => ({
      previewId: result.previewId,
      url: result.url,
      screenshot: result.screenshot,
      metadata: {
        title: result.metadata.title,
        description: result.metadata.description,
        keywords: result.metadata.keywords,
        language: result.metadata.language,
      },
      structure: result.structure,
      styles: result.styles,
      extractedAt: result.extractedAt.toISOString(),
      html: result.html,
      transformedHtml: result.transformedHtml,
      transformedScreenshot: result.transformedScreenshot,
      theme: result.theme,
      transformedAt: result.transformedAt.toISOString(),
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
