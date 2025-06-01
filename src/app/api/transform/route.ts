import { NextRequest, NextResponse } from "next/server";

import puppeteer from "puppeteer";

import { analyzeAndModernizeUrl } from "@/lib/geminiService";

export async function POST(request: NextRequest) {
  try {
    const { scrapedData, theme } = await request.json();

    if (!scrapedData || !theme) {
      return NextResponse.json({ error: "Scraped data and theme are required" }, { status: 400 });
    }

    // Generate transformed HTML based on theme
    // const transformedHtml = generateTransformedHtml(scrapedData, theme);
    const transformedHtml = await analyzeAndModernizeUrl(scrapedData.url, theme, scrapedData.originalHTML);

    // Create screenshot of transformed version
    const screenshot = await generateTransformedScreenshot(transformedHtml);

    return NextResponse.json({
      success: true,
      data: {
        html: transformedHtml,
        screenshot: `data:image/png;base64,${screenshot}`,
        theme,
        transformedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Transform error:", error);
    return NextResponse.json({ error: "Failed to transform website" }, { status: 500 });
  }
}

async function generateTransformedScreenshot(html: string): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 800 });
  await page.setContent(html, { waitUntil: "networkidle0" });

  const screenshot = await page.screenshot({
    type: "png",
    encoding: "base64",
    fullPage: false,
  });

  await browser.close();
  return screenshot;
}
