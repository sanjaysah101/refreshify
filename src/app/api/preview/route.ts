import { NextRequest, NextResponse } from "next/server";

import { previewStorage } from "@/lib/preview-storage";

// POST: Store transformed HTML and return preview ID
export async function POST(request: NextRequest) {
  try {
    const { html, theme, originalUrl } = await request.json();

    if (!html || !theme) {
      return NextResponse.json({ error: "HTML and theme are required" }, { status: 400 });
    }

    // Generate unique ID for this preview
    const previewId = generatePreviewId();

    // Store the transformed data
    await previewStorage.set(previewId, {
      html,
      theme,
      originalUrl: originalUrl || "",
      createdAt: new Date().toISOString(),
    });

    // Return the preview URL
    const previewUrl = `${getBaseUrl(request)}/api/preview/${previewId}`;

    return NextResponse.json({
      success: true,
      previewId,
      previewUrl,
    });
  } catch (error) {
    console.error("Preview storage error:", error);
    return NextResponse.json({ error: "Failed to store preview" }, { status: 500 });
  }
}

// GET: Serve stored HTML by preview ID (fallback for direct access)
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const previewId = url.pathname.split("/").pop();

  if (!previewId || !(await previewStorage.has(previewId))) {
    return new NextResponse("Preview not found", { status: 404 });
  }

  const previewData = await previewStorage.get(previewId);
  if (!previewData) {
    return new NextResponse("Preview not found", { status: 404 });
  }

  // Add meta tags for better sharing
  const enhancedHtml = addSharingMetaTags(previewData.html, previewData);

  return new NextResponse(enhancedHtml, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}

function generatePreviewId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getBaseUrl(request: NextRequest): string {
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  return `${protocol}://${host}`;
}

function addSharingMetaTags(html: string, data: any): string {
  const metaTags = `
    <meta property="og:title" content="Transformed Website - ${data.theme} Theme" />
    <meta property="og:description" content="View this website transformed with modern design using ${data.theme} theme" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Transformed Website - ${data.theme} Theme" />
    <meta name="twitter:description" content="Modern website transformation" />
  `;

  // Insert meta tags before closing head tag
  return html.replace("</head>", `${metaTags}</head>`);
}
